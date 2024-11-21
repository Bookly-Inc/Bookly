import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MoodService } from './mood.service';

@Module({
	imports: [
		ConfigModule,
		CacheModule.register({
			ttl: 86400, // 24 hours
			max: 100,
		}),
	],
	providers: [MoodService],
	exports: [MoodService],
})
export class MoodModule {}
