import { ApiProperty } from '@nestjs/swagger';
import { BooksResponseDto } from '../../google-books/dto/books-response.dto';
import { MoodResponseDto } from '../../mood-analysis/dto/mood-response.dto';
import { SpotifyTrackDto } from '../../spotify/dto/spotify-track.dto';

export class SwipeResponseDto {
	@ApiProperty({ type: BooksResponseDto })
	book: BooksResponseDto;

	@ApiProperty({ type: MoodResponseDto })
	mood: MoodResponseDto;

	@ApiProperty({ type: [SpotifyTrackDto] })
	musicSuggestions: SpotifyTrackDto[];
}
