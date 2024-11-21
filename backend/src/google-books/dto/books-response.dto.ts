// src/books/dto/book-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BooksResponseDto {
	@ApiProperty({ example: 'zyTCAlFPjgYC' })
	id: string;

	@ApiProperty({ example: 'Jujutsu Kaisen' })
	title: string;

	@ApiProperty({ example: ['Gege Akutami'] })
	authors: string[];

	@ApiProperty({
		example:
			'A manga series about a high school student who becomes a cursed spirit fighter.',
	})
	description: string;

	@ApiProperty({
		example:
			'https://books.google.com/books/content?id=xyz&printsec=frontcover',
	})
	coverImage: string;

	@ApiProperty({ example: ['Fiction'] })
	categories: string[];

	@ApiProperty({ example: 4.5 })
	rating: number;

	@ApiProperty({ example: 304 })
	pageCount: number;

	@ApiProperty({ example: '2020-09-29' })
	publishedDate: string;
}
