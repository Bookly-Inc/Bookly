import { Module } from '@nestjs/common';
import { GoogleBooksController } from './google-books.controller';
import { GoogleBooksService } from './google-books.service';

@Module({
	controllers: [GoogleBooksController],
	providers: [GoogleBooksService],
	exports: [GoogleBooksService], // Export if you need to use in other modules
})
export class GoogleBooksModule {}
