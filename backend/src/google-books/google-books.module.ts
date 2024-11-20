import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleBooksController } from './google-books.controller';
import { GoogleBooksService } from './google-books.service';

@Module({
	imports: [
		CacheModule.register({
			ttl: 3600,
			max: 100,
		}),
	],
	controllers: [GoogleBooksController],
	providers: [GoogleBooksService],
	exports: [GoogleBooksService], // Export if you need to use in other modules
})
export class GoogleBooksModule {}
