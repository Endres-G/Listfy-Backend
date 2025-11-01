export class ItemAssigneeDto {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export class ItemResponseDto {
  id: string;
  title: string;
  done: boolean;
  assignee: ItemAssigneeDto | null;
  isAssigned: boolean;
}
