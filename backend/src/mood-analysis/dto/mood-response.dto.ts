import { ApiProperty } from '@nestjs/swagger';

export class MoodAttributesDto {
	@ApiProperty({ example: 0.7 })
	valence: number;

	@ApiProperty({ example: 0.6 })
	energy: number;

	@ApiProperty({ example: 0.5 })
	acousticness: number;

	@ApiProperty({ example: 0.4 })
	danceability: number;
}

export class MoodResponseDto {
	@ApiProperty({ type: MoodAttributesDto })
	moodAttributes: MoodAttributesDto;

	@ApiProperty({ example: 'romantic' })
	primaryMood: string;

	@ApiProperty({ example: ['pop', 'indie-pop'] })
	musicalGenres: string[];

	@ApiProperty({ example: 'medium' })
	tempo: string;
}
