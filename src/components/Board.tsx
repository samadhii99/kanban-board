import React, { useState, useEffect } from "react";
import { Button, Typography, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import {
  addColumn,
  addCard,
  updateCard,
  deleteCard,
  updateColumn,
  deleteColumn,
  moveCard,
} from "../store/kanbanSlice";
import { KanbanCard } from "../types/kanban";
import Column from "./Column";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";

const { Title } = Typography;

const Board: React.FC = () => {
  const columns = useSelector((state: RootState) => state.kanban.columns);
  const dispatch = useDispatch();
  const [addColumnVisible, setAddColumnVisible] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // Initialize default columns if none exist - FIXED to run only once
  useEffect(() => {
    // Add this condition to ensure this only runs when needed
    if (columns.length === 0) {
      dispatch(addColumn({ title: "To Do" }));
      dispatch(addColumn({ title: "In Progress" }));
      dispatch(addColumn({ title: "Done" }));
    }
  }, []); // Empty dependency array - run only once on mount

  // Configure sensors for drag and drop with increased distance to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 80, // Increased minimum distance before a drag starts
      },
    })
  );

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch(addColumn({ title: newColumnTitle }));
      setNewColumnTitle("");
      setAddColumnVisible(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    const cardId = active.id as string;

    // Find the column that contains the card
    const sourceColumnId =
      columns.find((column) => column.cards.some((card) => card.id === cardId))
        ?.id || null;

    if (sourceColumnId) {
      setActiveColumnId(sourceColumnId);

      // Find the card
      const card = columns
        .find((col) => col.id === sourceColumnId)
        ?.cards.find((c) => c.id === cardId);

      if (card) {
        setActiveCard({ ...card }); // Use a copy to avoid reference issues
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Skip if we're dragging over the same card
    if (cardId === overId) return;

    // Find source column (where the card is coming from)
    const sourceColumn = columns.find((col) =>
      col.cards.some((card) => card.id === cardId)
    );

    // If we're not dragging over a column or card, return
    if (!sourceColumn) return;

    // Check if we're over a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn) {
      // We're dragging over a column - move to the end of that column
      if (sourceColumn.id !== overColumn.id) {
        const sourceIndex = sourceColumn.cards.findIndex(
          (card) => card.id === cardId
        );
        const destinationIndex = overColumn.cards.length;

        if (sourceIndex !== -1) {
          dispatch(
            moveCard({
              sourceColumnId: sourceColumn.id,
              destinationColumnId: overColumn.id,
              sourceIndex: sourceIndex,
              destinationIndex: destinationIndex,
              cardId: cardId,
            })
          );
        }
      }
      return;
    }

    // Check if we're over a card
    const overColumnId = columns.find((col) =>
      col.cards.some((card) => card.id === overId)
    )?.id;

    if (!overColumnId) return;

    // If we're dragging over a card
    const sourceIndex = sourceColumn.cards.findIndex(
      (card) => card.id === cardId
    );
    const destinationColumn = columns.find((col) => col.id === overColumnId);

    if (!destinationColumn) return;

    const destinationIndex = destinationColumn.cards.findIndex(
      (card) => card.id === overId
    );

    // Only dispatch if we have valid indices and something actually changed
    if (
      sourceIndex !== -1 &&
      destinationIndex !== -1 &&
      (sourceColumn.id !== destinationColumn.id ||
        sourceIndex !== destinationIndex)
    ) {
      dispatch(
        moveCard({
          sourceColumnId: sourceColumn.id,
          destinationColumnId: overColumnId,
          sourceIndex: sourceIndex,
          destinationIndex: destinationIndex,
          cardId: cardId,
        })
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // Reset active states
    setActiveCard(null);
    setActiveColumnId(null);

    // We don't need to handle the actual move here since it was handled in dragOver
  };

  // Helper function to check if an ID is a column ID
  const isColumnId = (id: string): boolean => {
    return columns.some((col) => col.id === id);
  };

  const handleUpdateCard = (columnId: string, updatedCard: KanbanCard) => {
    dispatch(
      updateCard({
        columnId,
        cardId: updatedCard.id,
        title: updatedCard.title,
        description: updatedCard.description,
        labels: updatedCard.labels || [],
        dueDate: updatedCard.dueDate,
        completed: updatedCard.completed,
      })
    );
  };

  return (
    <div className="kanban-board">
      <div className="board-header">
        <Title level={2}>Kanban Board</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddColumnVisible(true)}
        >
          Add Column
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="columns-container">
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddCard={(
                  columnId,
                  title,
                  description,
                  labels,
                  dueDate,
                  completed
                ) => {
                  dispatch(
                    addCard({
                      columnId,
                      title,
                      description,
                      labels: labels || [],
                      dueDate,
                      completed,
                    })
                  );
                }}
                onEditCard={(
                  columnId,
                  cardId,
                  title,
                  description,
                  labels,
                  dueDate,
                  completed
                ) => {
                  dispatch(
                    updateCard({
                      columnId,
                      cardId,
                      title,
                      description,
                      labels: labels || [],
                      dueDate,
                      completed,
                    })
                  );
                }}
                onDeleteCard={(columnId, cardId) => {
                  dispatch(deleteCard({ columnId, cardId }));
                }}
                onEditColumn={(columnId, title) => {
                  dispatch(updateColumn({ columnId, title }));
                }}
                onDeleteColumn={(columnId) => {
                  dispatch(deleteColumn({ columnId }));
                }}
                onUpdateCard={handleUpdateCard}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeCard && activeColumnId && (
            <div className="dragging">
              <Card
                card={activeCard}
                index={0}
                columnId={activeColumnId}
                onEdit={() => {}}
                onDelete={() => {}}
                onUpdate={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Modal
        title="Add New Column"
        open={addColumnVisible}
        onOk={handleAddColumn}
        onCancel={() => setAddColumnVisible(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <Input
          placeholder="Column Title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          onPressEnter={handleAddColumn}
        />
      </Modal>
    </div>
  );
};

export default Board;
