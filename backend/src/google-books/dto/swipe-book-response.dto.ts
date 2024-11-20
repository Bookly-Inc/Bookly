import { ApiProperty } from '@nestjs/swagger';

export class SwipeBooksResponseDto {
	@ApiProperty({ example: 'zyTCAlFPjgYC' })
	id: string;

	@ApiProperty({ example: 'The Midnight Library' })
	title: string;

	@ApiProperty({ example: ['Matt Haig'] })
	authors: string[];

	@ApiProperty({
		example: 'Between life and death there is a library...',
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
