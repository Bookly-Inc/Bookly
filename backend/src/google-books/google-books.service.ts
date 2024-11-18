import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SwipeBooksRequestDto } from './dto/swipe-books-request.dto';
import { SwipeBooksResponseDto } from './dto/swipe-book-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleBooksService {
	private readonly GOOGLE_BOOKS_API =
		'https://www.googleapis.com/books/v1/volumes';
	private readonly SUBJECTS = [
		'fiction',
		'fantasy',
		'romance',
		'thriller',
		'mystery',
		'science fiction',
		'contemporary',
		'classics',
	];
	private readonly API_KEY;

	constructor(private configService: ConfigService) {
		this.API_KEY = this.configService.get('GOOGLE_BOOKS_API_KEY', {
			infer: true,
		});
	}

	async getSwipeBooks(
		query: SwipeBooksRequestDto,
	): Promise<SwipeBooksResponseDto[]> {
		try {
			const randomSubject =
				this.SUBJECTS[Math.floor(Math.random() * this.SUBJECTS.length)];

			const response = await axios.get(this.GOOGLE_BOOKS_API, {
				params: {
					q: `subject:${randomSubject}`,
					maxResults: query.limit || 10,
					// filter: 'ebooks',
					langRestrict: 'en',
					key: this.API_KEY,
				},
			});

			if (!response.data.items) {
				return [];
			}

			return response.data.items.map(this.mapBookToDto);
		} catch (error) {
			console.error('Error fetching books:', error.message);
			throw new Error('Failed to fetch books for swiping');
		}
	}

	private mapBookToDto(book: any): SwipeBooksResponseDto {
		return {
			id: book.id,
			title: book.volumeInfo.title,
			authors: book.volumeInfo.authors || ['Unknown Author'],
			description: GoogleBooksService.truncateDescription(
				book.volumeInfo.description,
			),
			coverImage:
				book.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') ||
				'https://via.placeholder.com/128x196?text=No+Cover',
			categories: book.volumeInfo.categories || ['Uncategorized'],
			rating: book.volumeInfo.averageRating || 0,
			pageCount: book.volumeInfo.pageCount || 0,
			publishedDate: book.volumeInfo.publishedDate || 'Unknown',
		};
	}

	private static truncateDescription(description?: string): string {
		if (!description) return 'No description available';
		return description.length > 250
			? description.substring(0, 250) + '...'
			: description;
	}
}
