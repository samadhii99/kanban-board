import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KanbanBoard, KanbanCard, KanbanColumn } from "../types/kanban";
import { v4 as uuidv4 } from "uuid";

const initialState: KanbanBoard = {
  columns: [], // Columns added in useEffect
};

interface AddColumnPayload {
  title: string;
}

interface UpdateColumnPayload {
  columnId: string;
  title: string;
}

interface DeleteColumnPayload {
  columnId: string;
}

interface AddCardPayload {
  columnId: string;
  title: string;
  description: string;
  labels: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[]; // Added assignees field
}

interface UpdateCardPayload {
  columnId: string;
  cardId: string;
  title?: string;
  description?: string;
  labels?: string[];
  dueDate?: string;
  completed?: boolean;
  assignees?: string[]; // Added assignees field
}

interface DeleteCardPayload {
  columnId: string;
  cardId: string;
}

interface MoveCardPayload {
  sourceColumnId: string;
  destinationColumnId: string;
  sourceIndex: number;
  destinationIndex: number;
  cardId: string;
}

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    addColumn: (state, action: PayloadAction<AddColumnPayload>) => {
      const newColumn: KanbanColumn = {
        id: `column-${uuidv4()}`,
        title: action.payload.title,
        cards: [],
      };
      state.columns.push(newColumn);
    },

    updateColumn: (state, action: PayloadAction<UpdateColumnPayload>) => {
      const { columnId, title } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.title = title;
      }
    },

    deleteColumn: (state, action: PayloadAction<DeleteColumnPayload>) => {
      const { columnId } = action.payload;
      state.columns = state.columns.filter((column) => column.id !== columnId);
    },

    addCard: (state, action: PayloadAction<AddCardPayload>) => {
      const {
        columnId,
        title,
        description,
        labels,
        dueDate,
        completed,
        assignees,
      } = action.payload;
      const columnIndex = state.columns.findIndex((col) => col.id === columnId);

      if (columnIndex !== -1) {
        const newCard: KanbanCard = {
          id: `card-${uuidv4()}`,
          title,
          description,
          createdAt: new Date().toISOString(),
          labels,
          dueDate,
          completed,
          assignees, // Added assignees
        };
        state.columns[columnIndex].cards.push(newCard);
      }
    },

    updateCard: (state, action: PayloadAction<UpdateCardPayload>) => {
      const {
        columnId,
        cardId,
        title,
        description,
        labels,
        dueDate,
        completed,
        assignees,
      } = action.payload;
      const columnIndex = state.columns.findIndex((col) => col.id === columnId);

      if (columnIndex !== -1) {
        const cardIndex = state.columns[columnIndex].cards.findIndex(
          (card) => card.id === cardId
        );

        if (cardIndex !== -1) {
          const card = state.columns[columnIndex].cards[cardIndex];

          // Update card properties using the spread operator for more flexibility
          state.columns[columnIndex].cards[cardIndex] = {
            ...card,
            title: title !== undefined ? title : card.title,
            description:
              description !== undefined ? description : card.description,
            labels: labels !== undefined ? labels : card.labels,
            dueDate: dueDate !== undefined ? dueDate : card.dueDate,
            completed: completed !== undefined ? completed : card.completed,
            assignees: assignees !== undefined ? assignees : card.assignees,
          };
        }
      }
    },

    deleteCard: (state, action: PayloadAction<DeleteCardPayload>) => {
      const { columnId, cardId } = action.payload;
      const columnIndex = state.columns.findIndex((col) => col.id === columnId);

      if (columnIndex !== -1) {
        state.columns[columnIndex].cards = state.columns[
          columnIndex
        ].cards.filter((card) => card.id !== cardId);
      }
    },

    moveCard: (state, action: PayloadAction<MoveCardPayload>) => {
      const {
        sourceColumnId,
        destinationColumnId,
        sourceIndex,
        destinationIndex,
        cardId,
      } = action.payload;

      // Find source and destination columns indexes
      const sourceColumnIndex = state.columns.findIndex(
        (col) => col.id === sourceColumnId
      );
      const destinationColumnIndex = state.columns.findIndex(
        (col) => col.id === destinationColumnId
      );

      if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;

      // Don't proceed if no actual change
      if (
        sourceColumnId === destinationColumnId &&
        sourceIndex === destinationIndex
      )
        return;

      // Create a deep copy of the card to move
      const cardToMove = JSON.parse(
        JSON.stringify(state.columns[sourceColumnIndex].cards[sourceIndex])
      );

      // Verify we found the right card
      if (cardToMove.id !== cardId) return;

      // Remove from source
      state.columns[sourceColumnIndex].cards.splice(sourceIndex, 1);

      // Add to destination - adjust index if same column and removing affects the destination index
      let adjustedDestIndex = destinationIndex;
      if (
        sourceColumnId === destinationColumnId &&
        sourceIndex < destinationIndex
      ) {
        adjustedDestIndex--;
      }

      // Add to destination at the adjusted index
      state.columns[destinationColumnIndex].cards.splice(
        adjustedDestIndex,
        0,
        cardToMove
      );
    },
  },
});

export const {
  addColumn,
  updateColumn,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
} = kanbanSlice.actions;
export default kanbanSlice.reducer;
