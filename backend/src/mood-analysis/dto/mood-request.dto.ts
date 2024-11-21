import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class MoodRequestDto {
	@ApiProperty({ example: 'The Midnight Library' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		example: 'Between life and death there is a library...',
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({ example: ['Fiction', 'Fantasy'] })
	@IsArray()
	@IsString({ each: true })
	categories: string[];
}
