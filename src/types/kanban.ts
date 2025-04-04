export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
}
