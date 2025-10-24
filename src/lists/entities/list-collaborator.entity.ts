import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { List } from '../../lists/entities/list.entity';

export type CollaboratorRole = 'owner' | 'editor' | 'viewer';

@Entity('list_collaborators')
@Unique(['list', 'user'])
export class ListCollaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => List, (l) => (l as any).collaborators, { onDelete: 'CASCADE' })
  list: List;

  @ManyToOne(() => User, (u) => (u as any).collaborations, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 10 })
  role: CollaboratorRole;

  @CreateDateColumn()
  createdAt: Date;
}
