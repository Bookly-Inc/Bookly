import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
	imports: [
		ConfigModule,
		CacheModule.register({
			ttl: 3600,
			max: 100,
		}),
	],
	controllers: [SpotifyController],
	providers: [SpotifyService],
	exports: [SpotifyService],
})
export class SpotifyModule {}
