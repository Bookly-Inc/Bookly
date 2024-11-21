import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export enum SwipeAction {
	LIKE = 'like',
	DISLIKE = 'dislike',
}

export class SwipeRequestDto {
	@ApiProperty({ enum: SwipeAction })
	@IsEnum(SwipeAction)
	action: SwipeAction;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	bookId: string;
}
