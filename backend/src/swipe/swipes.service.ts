import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Swipe } from './entities/swipe.entity';
import { GoogleBooksService } from '../google-books/google-books.service';
import { MoodService } from '../mood-analysis/mood.service';
import { SpotifyService } from '../spotify/spotify.service';
import { SwipeAction, SwipeRequestDto } from './dto/swipe-request.dto';
import { SwipeResponseDto } from './dto/swipe-response.dto';

@Injectable()
export class SwipesService {
	constructor(
		@InjectRepository(Swipe)
		private readonly swipesRepository: Repository<Swipe>,
		private readonly googleBooksService: GoogleBooksService,
		private readonly moodService: MoodService,
		private readonly spotifyService: SpotifyService,
	) {}

	async discover(
		userId: string,
		spotifyToken: string,
	): Promise<SwipeResponseDto> {
		// Get books we haven't shown to this user yet
		const seenBookIds = await this.getSeenBookIds(userId);
		let books;
		let attempts = 0;

		// Keep trying until we find an unseen book or reach max attempts
		do {
			books = await this.googleBooksService.getBooks({ limit: 1 });
			attempts++;
		} while (seenBookIds.includes(books[0].id) && attempts < 3);

		const book = books[0];

		// Analyze book mood
		const mood = await this.moodService.analyzeMood({
			title: book.title,
			description: book.description,
			categories: book.categories,
		});

		// Get music recommendations
		const musicSuggestions = await this.spotifyService.getRecommendations(
			mood.moodAttributes,
			spotifyToken,
		);

		return {
			book,
			mood,
			musicSuggestions,
		};
	}

	async recordSwipe(
		userId: string,
		swipeDto: SwipeRequestDto,
		currentBook: any,
		currentMood: any,
		currentMusic: any,
	): Promise<Swipe> {
		// Create swipe record
		const swipe = this.swipesRepository.create({
			userId,
			bookId: swipeDto.bookId,
			action: swipeDto.action,
			bookData: currentBook,
			mood: currentMood,
			musicSuggestions:
				swipeDto.action === SwipeAction.LIKE ? currentMusic : null,
		});

		return this.swipesRepository.save(swipe);
	}

	async getCollection(userId: string) {
		const likes = await this.swipesRepository.find({
			where: {
				userId,
				action: SwipeAction.LIKE,
			},
			order: {
				createdAt: 'DESC',
			},
		});

		return likes.map((like) => ({
			book: like.bookData,
			mood: like.mood,
			musicSuggestions: like.musicSuggestions,
		}));
	}

	private async getSeenBookIds(userId: string): Promise<string[]> {
		const swipes = await this.swipesRepository.find({
			where: { userId },
			select: ['bookId'],
		});

		return swipes.map((swipe) => swipe.bookId);
	}
}
