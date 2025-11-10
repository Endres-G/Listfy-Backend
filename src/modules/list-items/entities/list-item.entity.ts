import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['name', 'list'])
export class ListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ManyToOne(() => List, (list) => list.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listId' })
  list: List;

  @ManyToOne(() => User, (user) => user.assignedItems, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo?: User;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
