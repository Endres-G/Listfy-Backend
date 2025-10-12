import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { ListCollaborator } from '../../lists/entities/list-collaborator.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => List, (l) => l.owner)
  ownedLists: List[];

  @OneToMany(() => ListCollaborator, (c) => c.user)
  collaborations: ListCollaborator[];
}
