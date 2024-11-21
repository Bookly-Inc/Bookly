import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyTrackDto } from './dto/spotify-track.dto';
import { MoodAttributesDto } from '../mood-analysis/dto/mood-response.dto';

@Injectable()
export class SpotifyService {
	async getRecommendations(
		moodAttributes: MoodAttributesDto,
		accessToken: string,
	): Promise<SpotifyTrackDto[]> {
		try {
			const spotifyApi = new SpotifyWebApi();
			spotifyApi.setAccessToken(accessToken);

			// Get user's top tracks and artists
			const [topTracks, topArtists] = await Promise.all([
				spotifyApi.getMyTopTracks({ limit: 2 }),
				spotifyApi.getMyTopArtists({ limit: 1 }),
			]);

			const recommendations = await spotifyApi.getRecommendations({
				seed_tracks: topTracks.body.items.map((track) => track.id),
				seed_artists: topArtists.body.items.map((artist) => artist.id),
				limit: 3,
				target_valence: moodAttributes.valence,
				target_energy: moodAttributes.energy,
				target_acousticness: moodAttributes.acousticness,
				target_danceability: moodAttributes.danceability,
				min_popularity: 30,
			});

			return recommendations.body.tracks.map((track) => ({
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				albumName: track.album.name,
				previewUrl: track.preview_url,
				spotifyUrl: track.external_urls.spotify,
				imageUrl: track.album.images[0]?.url,
			}));
		} catch (error) {
			throw new HttpException(
				`${error}: Failed to get Spotify recommendations`,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
