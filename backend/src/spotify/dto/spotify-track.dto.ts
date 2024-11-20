import { ApiProperty } from '@nestjs/swagger';

export class SpotifyTrackDto {
	@ApiProperty({
		example: '11dFghVXANMlKmJXsNCbNl',
	})
	id: string;

	@ApiProperty({
		example: 'Cut To The Feeling',
	})
	name: string;

	@ApiProperty({
		example: 'Carly Rae Jepsen',
	})
	artist: string;

	@ApiProperty({
		example: 'Emotion',
	})
	albumName: string;

	@ApiProperty({
		example: 'https://p.scdn.co/mp3-preview/...',
	})
	previewUrl: string | null;

	@ApiProperty({
		example: 'https://open.spotify.com/track/...',
	})
	spotifyUrl: string;

	@ApiProperty({
		example: 'https://i.scdn.co/image/...',
	})
	imageUrl: string;
}
