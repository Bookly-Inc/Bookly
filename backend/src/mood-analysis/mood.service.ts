import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MoodRequestDto } from './dto/mood-request.dto';
import { MoodResponseDto } from './dto/mood-response.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class MoodService {
	private readonly model: any;

	constructor(
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
	) {
		const apiKey = this.configService.get<string>('GEMINI_API_KEY', {
			infer: true,
		});
		if (!apiKey) {
			throw new Error('GEMINI_API_KEY is not defined');
		}

		const genAI = new GoogleGenerativeAI(apiKey);
		this.model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
	}

	async analyzeMood(request: MoodRequestDto): Promise<MoodResponseDto> {
		const cacheKey = `mood-${request.title}`;
		const cached = await this.cacheManager.get<MoodResponseDto>(cacheKey);

		if (cached) {
			return cached;
		}

		try {
			const prompt = this.buildPrompt(request);
			const result = await this.model.generateContent(prompt);
			const response = result.response.text();

			const analysis = JSON.parse(response);
			await this.cacheManager.set(cacheKey, analysis, 86400); // Cache for 24 hours

			return analysis;
		} catch (error) {
			if (error instanceof SyntaxError) {
				// JSON parsing error
				throw new HttpException(
					'Failed to analyze book mood',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
			throw new HttpException(
				'Mood analysis service unavailable',
				HttpStatus.SERVICE_UNAVAILABLE,
			);
		}
	}

	private buildPrompt(request: MoodRequestDto): string {
		return `
      Analyze this book's mood and atmosphere for music recommendation purposes:
      
      Title: ${request.title}
      Categories: ${request.categories.join(', ')}
      Description: ${request.description}

      Respond only with a JSON object containing:
      {
        "moodAttributes": {
          "valence": <number 0-1, representing positivity>,
          "energy": <number 0-1, representing intensity>,
          "acousticness": <number 0-1>,
          "danceability": <number 0-1>
        },
        "primaryMood": <one of: "happy", "sad", "mysterious", "romantic", "dark", "energetic", "calm", "epic">,
        "musicalGenres": <array of 2-3 most fitting Spotify genres>,
        "tempo": <"slow", "medium", "fast">
      }
    `;
	}

	private getFallbackAnalysis(category: string): MoodResponseDto {
		const fallbacks: Record<string, MoodResponseDto> = {
			Romance: {
				moodAttributes: {
					valence: 0.7,
					energy: 0.5,
					acousticness: 0.6,
					danceability: 0.6,
				},
				primaryMood: 'romantic',
				musicalGenres: ['pop', 'indie-pop'],
				tempo: 'medium',
			},
			Mystery: {
				moodAttributes: {
					valence: 0.4,
					energy: 0.6,
					acousticness: 0.4,
					danceability: 0.3,
				},
				primaryMood: 'mysterious',
				musicalGenres: ['ambient', 'electronic'],
				tempo: 'slow',
			},
		};

		return (
			fallbacks[category] || {
				moodAttributes: {
					valence: 0.5,
					energy: 0.5,
					acousticness: 0.5,
					danceability: 0.5,
				},
				primaryMood: 'calm',
				musicalGenres: ['indie', 'ambient'],
				tempo: 'medium',
			}
		);
	}
}
