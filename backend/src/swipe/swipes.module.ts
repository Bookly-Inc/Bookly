import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';
import { Swipe } from './entities/swipe.entity';
import { GoogleBooksModule } from '../google-books/google-books.module';
import { MoodModule } from '../mood-analysis/mood.module';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Swipe]),
		GoogleBooksModule,
		MoodModule,
		SpotifyModule,
	],
	controllers: [SwipesController],
	providers: [SwipesService],
})
export class SwipesModule {}
