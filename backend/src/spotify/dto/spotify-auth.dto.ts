import { ApiProperty } from '@nestjs/swagger';

export class SpotifyAuthDto {
	@ApiProperty({
		description: 'Spotify access token',
		example: 'BQD1QvN...mxd6A',
	})
	accessToken: string;

	@ApiProperty({
		description: 'Spotify refresh token',
		example: 'AQAz...uXyA',
	})
	refreshToken: string;

	@ApiProperty({
		description: 'Token expiration time in seconds',
		example: 3600,
	})
	expiresIn: number;
}

export class SpotifyCallbackDto {
	@ApiProperty({
		description: 'Authorization code from Spotify',
		example: 'AQD...XyZ',
	})
	code: string;

	@ApiProperty({
		description: 'State parameter for security',
		example: 'some-state-value',
	})
	state?: string;
}
