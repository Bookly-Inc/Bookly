import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { GoogleBooksService } from './google-books.service';
import { SwipeBooksRequestDto } from './dto/swipe-books-request.dto';
import { SwipeBooksResponseDto } from './dto/swipe-book-response.dto';

@ApiTags('Books')
@Controller('books')
export class GoogleBooksController {
	constructor(private readonly googleBooksService: GoogleBooksService) {}

	@Get('swipe')
	@ApiResponse({
		status: 200,
		description: 'Returns a list of books for swiping',
		type: [SwipeBooksResponseDto],
	})
	async getSwipeBooks(@Query() query: SwipeBooksRequestDto) {
		return this.googleBooksService.getSwipeBooks(query);
	}
}
