import { Controller, Post, Get, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CollabService } from './collab.service';
import { AddCollaboratorDto } from './dto/add-collaborator.dto';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // descomente se você já tem auth

@Controller('lists/:id/collaborators')
// @UseGuards(JwtAuthGuard)
export class CollabController {
  constructor(private readonly collab: CollabService) {}

  @Post()
  add(@Param('id') id: string, @Body() dto: AddCollaboratorDto, @Req() req) {
    return this.collab.addCollaborator(id, dto, req.user.sub);
  }

  @Get()
  list(@Param('id') id: string, @Req() req) {
    return this.collab.listCollaborators(id, req.user.sub);
  }

  @Patch(':userId')
  update(@Param('id') id: string, @Param('userId') userId: string, @Body() body: { role: 'viewer'|'editor' }, @Req() req) {
    return this.collab.updateCollaboratorRole(id, userId, body.role, req.user.sub);
  }

  @Delete(':userId')
  remove(@Param('id') id: string, @Param('userId') userId: string, @Req() req) {
    return this.collab.removeCollaborator(id, userId, req.user.sub);
  }
}
