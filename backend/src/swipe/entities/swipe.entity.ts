import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Index,
} from 'typeorm';
import { SwipeAction } from '../dto/swipe-request.dto';

@Entity('swipes')
export class Swipe {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Index()
	userId: string;

	@Column()
	bookId: string;

	@Column({
		type: 'enum',
		enum: SwipeAction,
	})
	action: SwipeAction;

	@Column('jsonb')
	bookData: Record<string, any>;

	@Column('jsonb', { nullable: true })
	mood: Record<string, any>;

	@Column('jsonb', { nullable: true })
	musicSuggestions: Record<string, any>[];

	@CreateDateColumn()
	@Index()
	createdAt: Date;
}
