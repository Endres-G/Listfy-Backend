import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CollabService } from '../collab.service';

@Injectable()
export class ItemsPermissionGuard implements CanActivate {
  constructor(private readonly collab: CollabService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const method: string = req.method;
    const userId: string | undefined = req?.user?.sub;

    // Só intercepta rotas de itens com padrão /lists/:listId/items
    // Ajuste o teste se sua rota for diferente
    const url: string = req.originalUrl || req.url || '';
    const match = url.match(/\/lists\/([^/]+)\/items/);
    if (!match) return true; // não é rota de items

    const listId = match[1];
    if (!userId) return false;

    if (method === 'GET') {
      await this.collab.assertCanView(listId, userId);
      return true;
    }

    // POST, PATCH, DELETE => editor+
    await this.collab.assertCanEdit(listId, userId);
    return true;
  }
}
