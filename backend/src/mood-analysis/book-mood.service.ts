import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BookMoodAnalysisDto } from './dto/book-mood.dto';

@Injectable()
export class MoodAnalysisService {
	private readonly logger = new Logger(MoodAnalysisService.name);
	private genAI: GoogleGenerativeAI;
	private model: any;

	constructor(private configService: ConfigService) {
		const apiKey = this.configService.get('GEMINI_API_KEY');
		if (!apiKey) {
			throw new Error('GEMINI_API_KEY is not defined');
		}

		this.genAI = new GoogleGenerativeAI(apiKey);
		this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
	}

	async analyzeBookMood(book: {
		title: string;
		description: string;
		categories: string[];
	}): Promise<BookMoodAnalysisDto> {
		try {
			this.logger.log(`Analyzing mood for book: ${book.title}`);

			const prompt = `
        Analyze this book's mood and atmosphere for music recommendation purposes:
        
        Title: ${book.title}
        Categories: ${book.categories.join(', ')}
        Description: ${book.description}

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
          "tempo": <"slow", "medium", "fast">,
          "keySignature": <"major" or "minor">,
          "themes": <array of 2-3 main themes>
        }
      `;

			const result = await this.model.generateContent(prompt);
			const response = result.response.text();

			const analysis = JSON.parse(response);
			this.logger.debug('Mood analysis result:', analysis);

			return analysis;
		} catch (error) {
			this.logger.error(`Error analyzing book mood: ${error.message}`);
			return this.getFallbackAnalysis(book.categories[0]);
		}
	}

	private getFallbackAnalysis(category: string): BookMoodAnalysisDto {
		const defaultMoods: Record<string, BookMoodAnalysisDto> = {
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
				keySignature: 'major',
				themes: ['love', 'relationships'],
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
				keySignature: 'minor',
				themes: ['suspense', 'intrigue'],
			},
			// Add more genre mappings as needed
		};

		return (
			defaultMoods[category] || {
				moodAttributes: {
					valence: 0.5,
					energy: 0.5,
					acousticness: 0.5,
					danceability: 0.5,
				},
				primaryMood: 'calm',
				musicalGenres: ['indie', 'ambient'],
				tempo: 'medium',
				keySignature: 'major',
				themes: ['general'],
			}
		);
	}
}
