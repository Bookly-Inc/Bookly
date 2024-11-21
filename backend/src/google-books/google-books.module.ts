import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleBooksService } from './google-books.service';

@Module({
	imports: [
		CacheModule.register({
			ttl: 3600,
			max: 100,
		}),
	],
	providers: [GoogleBooksService],
	exports: [GoogleBooksService],
})
export class GoogleBooksModule {}
