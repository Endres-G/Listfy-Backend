import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { List } from '../lists/entities/list.entity';
import { User } from '../users/entities/user.entity';
import { ListCollaborator, CollaboratorRole } from './entities/list-collaborator.entity';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';

@Injectable()
export class CollabService {
  constructor(
    @InjectRepository(List) private readonly listRepo: Repository<List>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(ListCollaborator) private readonly collabRepo: Repository<ListCollaborator>,
  ) {}

  /** Obtém a role do usuário numa lista (owner/editor/viewer ou null) */
  async getUserRole(listId: string, userId: string): Promise<CollaboratorRole | null> {
    const list = await this.listRepo.findOne({ where: { id: listId } as FindOptionsWhere<List>, relations: { owner: true } as any });
    if (!list) return null;
    const ownerId = (list as any)?.owner?.id;
    if (ownerId && ownerId === userId) return 'owner';
    const c = await this.collabRepo.findOne({ where: { list: { id: listId } as any, user: { id: userId } as any } });
    return c?.role ?? null;
  }

  private requireAtLeast(required: CollaboratorRole, current: CollaboratorRole | null) {
    const order = { viewer: 1, editor: 2, owner: 3 } as const;
    if (!current || order[current] < order[required]) {
      throw new ForbiddenException('Sem permissão para esta operação.');
    }
  }

  async assertCanView(listId: string, userId: string) {
    const role = await this.getUserRole(listId, userId);
    this.requireAtLeast('viewer', role);
  }

  async assertCanEdit(listId: string, userId: string) {
    const role = await this.getUserRole(listId, userId);
    this.requireAtLeast('editor', role);
  }

  async assertIsOwner(listId: string, userId: string) {
    const role = await this.getUserRole(listId, userId);
    this.requireAtLeast('owner', role);
  }

  /** Adiciona/atualiza colaborador sem alterar entidades/módulos existentes */
  async addCollaborator(listId: string, dto: AddCollaboratorDto, requesterId: string) {
    await this.assertIsOwner(listId, requesterId);

    let user: User | null = null;
    if (dto.userId) {
      user = await this.userRepo.findOne({ where: { id: dto.userId } as any });
    } else if (dto.email) {
      user = await this.userRepo.findOne({ where: { email: dto.email } as any });
    }
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const list = await this.listRepo.findOne({ where: { id: listId } as any });
    if (!list) throw new NotFoundException('Lista não encontrada');

    const existing = await this.collabRepo.findOne({ where: { list: { id: listId } as any, user: { id: (user as any).id } as any } });
    if (existing) {
      existing.role = dto.role;
      return this.collabRepo.save(existing);
    }

    const collab = this.collabRepo.create({ list, user, role: dto.role });
    return this.collabRepo.save(collab);
  }

  async listCollaborators(listId: string, requesterId: string) {
    await this.assertCanView(listId, requesterId);
    return this.collabRepo.find({ where: { list: { id: listId } as any }, relations: { user: true } as any });
  }

  async updateCollaboratorRole(listId: string, userId: string, role: 'viewer' | 'editor', requesterId: string) {
    await this.assertIsOwner(listId, requesterId);
    const collab = await this.collabRepo.findOne({ where: { list: { id: listId } as any, user: { id: userId } as any }, relations: { user: true } as any });
    if (!collab) throw new NotFoundException('Colaborador não encontrado');
    collab.role = role;
    return this.collabRepo.save(collab);
  }

  async removeCollaborator(listId: string, userId: string, requesterId: string) {
    await this.assertIsOwner(listId, requesterId);
    await this.collabRepo.delete({ list: { id: listId } as any, user: { id: userId } as any });
    return { removed: true };
  }
}
