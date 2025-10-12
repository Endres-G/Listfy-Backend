import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { List } from './list.entity';

@Entity('list_items')
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => List, (l) => l.items, { onDelete: 'CASCADE' })
  list: List;

  @Column()
  name: string;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  checked: boolean;

  @Column({ nullable: true })
  notes?: string;
}
