import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from './list-item.entity';
import { ListCollaborator } from './list-collaborator.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  title: string;

  @ManyToOne(() => User, (u) => u.ownedLists, { eager: true })
  owner: User;

  @OneToMany(() => ListItem, (i) => i.list, { cascade: true })
  items: ListItem[];

  @OneToMany(() => ListCollaborator, (c) => c.list, { cascade: true })
  collaborators: ListCollaborator[];

  @Column({ default: false })
  isArchived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
