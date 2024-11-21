// src/google-books/google-books.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import axios from 'axios';
import { BooksRequestDto } from './dto/books-request.dto';
import { BooksResponseDto } from './dto/books-response.dto';

@Injectable()
export class GoogleBooksService {
	private readonly apiUrl = 'https://www.googleapis.com/books/v1/volumes';
	private readonly defaultSubject = 'fiction';

	constructor(
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
	) {
		const apiKey = this.configService.get<string>('GOOGLE_BOOKS_API_KEY', {
			infer: true,
		});
		if (!apiKey) {
			throw new Error('GOOGLE_BOOKS_API_KEY is not defined');
		}
	}

	async getBooks(request: BooksRequestDto): Promise<BooksResponseDto[]> {
		const cacheKey = `google-books-${request.limit || 10}`;
		const cached = await this.cacheManager.get<BooksResponseDto[]>(cacheKey);

		if (cached) {
			return cached;
		}

		const books = await this.fetchBooks(request);
		await this.cacheManager.set(cacheKey, books, 3600);
		return books;
	}

	private async fetchBooks(
		request: BooksRequestDto,
	): Promise<BooksResponseDto[]> {
		try {
			const startIndex = Math.floor(Math.random() * 100);
			const response = await axios.get(this.apiUrl, {
				params: {
					q: `subject:${this.defaultSubject}`,
					maxResults: request.limit || 10,
					startIndex,
					langRestrict: 'en',
					key: this.configService.get('GOOGLE_BOOKS_API_KEY', {
						infer: true,
					}),
					fields:
						'items(id,volumeInfo(title,authors,description,imageLinks,categories,averageRating,pageCount,publishedDate))',
					orderBy: 'relevance',
					printType: 'books',
				},
			});

			if (!response.data.items) {
				return [];
			}

			return response.data.items
				.filter((book) => this.isValidBook(book))
				.map((book) => this.mapToBookResponse(book));
		} catch (error) {
			throw new HttpException(
				`${error}: Failed to fetch books from Google Books API`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	private isValidBook(book: any): boolean {
		const info = book?.volumeInfo;
		return !!(info?.title && info?.imageLinks?.thumbnail && info?.description);
	}

	private mapToBookResponse(book: any): BooksResponseDto {
		const info = book.volumeInfo;
		return {
			id: book.id,
			title: info.title,
			authors: info.authors || ['Unknown Author'],
			description: this.truncateDescription(info.description),
			coverImage: this.processImageUrl(info.imageLinks?.thumbnail),
			categories: info.categories || [this.defaultSubject],
			rating: info.averageRating || 0,
			pageCount: info.pageCount || 0,
			publishedDate: info.publishedDate || 'Unknown',
		};
	}

	private truncateDescription(description?: string): string {
		if (!description) {
			return 'No description available';
		}
		return description.length > 250
			? `${description.substring(0, 250)}...`
			: description;
	}

	private processImageUrl(url: string): string {
		if (!url) {
			return 'https://via.placeholder.com/128x196?text=No+Cover';
		}
		return url.replace('http:', 'https:').replace('&edge=curl', '');
	}
}
