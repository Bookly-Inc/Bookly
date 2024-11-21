import {
	Controller,
	Get,
	Post,
	Body,
	Headers,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { SwipesService } from './swipes.service';
import { SwipeRequestDto } from './dto/swipe-request.dto';
import { SwipeResponseDto } from './dto/swipe-response.dto';

@ApiTags('Swipes')
@Controller('swipes')
export class SwipesController {
	constructor(private readonly swipesService: SwipesService) {}

	@Get('discover')
	@ApiResponse({
		status: 200,
		description: 'Returns next book with mood and music suggestions',
		type: SwipeResponseDto,
	})
	@ApiHeader({ name: 'spotify-access-token', required: true })
	@ApiHeader({ name: 'user-id', required: true })
	async discover(
		@Headers('spotify-access-token') spotifyToken: string,
		@Headers('user-id') userId: string,
	): Promise<SwipeResponseDto> {
		if (!userId || !spotifyToken) {
			throw new HttpException(
				'Missing required headers',
				HttpStatus.BAD_REQUEST,
			);
		}

		return this.swipesService.discover(userId, spotifyToken);
	}

	@Post()
	@ApiResponse({
		status: 201,
		description: 'Record swipe action',
	})
	@ApiHeader({ name: 'user-id', required: true })
	async swipe(
		@Headers('user-id') userId: string,
		@Body() swipeDto: SwipeRequestDto,
		@Body('currentBook') currentBook: any,
		@Body('currentMood') currentMood: any,
		@Body('currentMusic') currentMusic: any,
	) {
		if (!userId) {
			throw new HttpException('Missing user-id header', HttpStatus.BAD_REQUEST);
		}

		return this.swipesService.recordSwipe(
			userId,
			swipeDto,
			currentBook,
			currentMood,
			currentMusic,
		);
	}

	@Get('collection')
	@ApiResponse({
		status: 200,
		description: "Get user's liked books with their music",
	})
	@ApiHeader({ name: 'user-id', required: true })
	async getCollection(@Headers('user-id') userId: string) {
		if (!userId) {
			throw new HttpException('Missing user-id header', HttpStatus.BAD_REQUEST);
		}

		return this.swipesService.getCollection(userId);
	}
}
