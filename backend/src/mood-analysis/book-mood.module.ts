import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MoodAnalysisService } from './mood-analysis.service';

@Module({
	imports: [ConfigModule],
	providers: [MoodAnalysisService],
	exports: [MoodAnalysisService],
})
export class MoodAnalysisModule {}
