// src/types/kanban.ts
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string; // Made optional with ? modifier
  labels?: string[];
  completed?: boolean; // Made optional with ? modifier
  dueDate?: string;
  assignees?: string[];
  subtasks?: SubTask[];
  percentage?: number;
  createdAt?: number; // Made optional
  updatedAt?: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
}
