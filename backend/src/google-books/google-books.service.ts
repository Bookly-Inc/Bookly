import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { SwipeBooksRequestDto } from './dto/swipe-books-request.dto';
import { SwipeBooksResponseDto } from './dto/swipe-book-response.dto';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class GoogleBooksService {
	private readonly GOOGLE_BOOKS_API =
		'https://www.googleapis.com/books/v1/volumes';
	private readonly DEFAULT_SUBJECT = 'fiction';
	private readonly API_KEY: string;
	private readonly CACHE_TTL = 3600; // 1 hour

	constructor(
		private configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		this.API_KEY = this.configService.get('GOOGLE_BOOKS_API_KEY', {
			infer: true,
		}) as string;
		if (!this.API_KEY) {
			throw new Error('GOOGLE_BOOKS_API_KEY is not defined');
		}
	}

	async getSwipeBooks(
		query: SwipeBooksRequestDto,
		subject?: string,
	): Promise<SwipeBooksResponseDto[]> {
		const limit = query.limit || 10;
		const selectedSubject = subject || this.DEFAULT_SUBJECT;
		const cacheKey = `swipe-books-${limit}-${selectedSubject}`;

		// Try to get from cache first
		const cachedBooks =
			await this.cacheManager.get<SwipeBooksResponseDto[]>(cacheKey);
		if (cachedBooks) {
			return cachedBooks;
		}

		try {
			const books = await this.fetchBooks(limit, selectedSubject);
			// Cache the results
			await this.cacheManager.set(cacheKey, books, this.CACHE_TTL);
			return books;
		} catch (error) {
			this.handleError(error);
		}
	}

	private async fetchBooks(
		limit: number,
		subject: string,
	): Promise<SwipeBooksResponseDto[]> {
		const startIndex = Math.floor(Math.random() * 100); // Random starting point for variety

		const response = await axios.get(this.GOOGLE_BOOKS_API, {
			params: {
				q: `subject:${subject}`,
				maxResults: limit,
				startIndex,
				langRestrict: 'en',
				key: this.API_KEY,
				fields:
					'items(id,volumeInfo(title,authors,description,imageLinks,categories,averageRating,pageCount,publishedDate))',
				orderBy: 'relevance',
				printType: 'books',
			},
		});

		if (!response.data.items) {
			return [];
		}

		return this.processBooks(response.data.items);
	}

	private processBooks(books: any[]): SwipeBooksResponseDto[] {
		return books
			.filter((book) => this.isValidBook(book))
			.map((book) => this.mapBookToDto(book));
	}

	private isValidBook(book: any): boolean {
		return (
			book.volumeInfo &&
			book.volumeInfo.title &&
			book.volumeInfo.imageLinks?.thumbnail &&
			book.volumeInfo.description
		);
	}

	private mapBookToDto(book: any): SwipeBooksResponseDto {
		const volumeInfo = book.volumeInfo;
		return {
			id: book.id,
			title: volumeInfo.title,
			authors: volumeInfo.authors || ['Unknown Author'],
			description: this.truncateDescription(volumeInfo.description),
			coverImage: this.processImageUrl(volumeInfo.imageLinks?.thumbnail),
			categories: volumeInfo.categories || [this.DEFAULT_SUBJECT],
			rating: volumeInfo.averageRating || 0,
			pageCount: volumeInfo.pageCount || 0,
			publishedDate: volumeInfo.publishedDate || 'Unknown',
		};
	}

	private processImageUrl(url: string): string {
		if (!url) return 'https://via.placeholder.com/128x196?text=No+Cover';
		return url.replace('http:', 'https:').replace('&edge=curl', '');
	}

	private truncateDescription(description?: string): string {
		if (!description) return 'No description available';
		return description.length > 250
			? `${description.substring(0, 250)}...`
			: description;
	}

	private handleError(error: any): never {
		const message =
			error.response?.data?.error?.message || 'Failed to fetch books';
		const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
		throw new HttpException(message, status);
	}
}
