import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Input, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { KanbanColumn, KanbanCard } from "../types/kanban";
import Column from "./Column";
import FilterBar from "./FilterBar";

import {
  addColumn,
  updateColumn,
  deleteColumn,
  addCard,
  updateCard,
  deleteCard,
  moveCard,
} from "../store/kanbanSlice";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RootState } from "../store";
import KanbanCardComponent from "./KanbanCard";

const Board: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.kanban.columns);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: "card" | "column";
    card?: KanbanCard;
    columnId?: string;
  } | null>(null);

  // Filter state
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const [memberFilter, setMemberFilter] = useState<string[]>([]);
  // Use underscore to mark as intentionally unused
  const [_groupBy, setGroupBy] = useState<string | null>(null);

  // Add this initialization flag
  const isInitialized = useRef(false);

  // Configure sensors for better drag and drop experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Load initial data - modified to prevent duplicate initialization
  useEffect(() => {
    if (columns.length === 0 && !isInitialized.current) {
      isInitialized.current = true;
      dispatch(addColumn({ title: "To Do" }));
      dispatch(addColumn({ title: "In Progress" }));
      dispatch(addColumn({ title: "Done" }));
    }
  }, [dispatch, columns.length]);

  // Get all available labels from cards
  const getAllLabels = (): string[] => {
    const labelsSet = new Set<string>();

    columns.forEach((column) => {
      column.cards.forEach((card) => {
        card.labels?.forEach((label) => {
          labelsSet.add(label);
        });
      });
    });

    return Array.from(labelsSet);
  };

  // Get all available members from cards
  const getAllMembers = (): string[] => {
    const membersSet = new Set<string>();

    columns.forEach((column) => {
      column.cards.forEach((card) => {
        card.assignees?.forEach((assignee) => {
          membersSet.add(assignee);
        });
      });
    });

    return Array.from(membersSet);
  };

  // Apply filters to columns data
  const getFilteredColumns = (): KanbanColumn[] => {
    return columns.map((column) => {
      // Filter cards based on current filter criteria
      const filteredCards = column.cards.filter((card) => {
        // Priority filter
        if (priorityFilter.length > 0) {
          const cardPriorities =
            card.labels?.filter((label) => label.includes("Priority")) || [];

          if (
            !cardPriorities.some((priority) =>
              priorityFilter.includes(priority)
            )
          ) {
            return false;
          }
        }

        // Label filter
        if (labelFilter.length > 0) {
          if (
            !card.labels ||
            !card.labels.some((label) => labelFilter.includes(label))
          ) {
            return false;
          }
        }

        // Member filter
        if (memberFilter.length > 0) {
          if (
            !card.assignees ||
            !card.assignees.some((member) => memberFilter.includes(member))
          ) {
            return false;
          }
        }

        return true;
      });

      // Sort cards if sortBy is specified
      let sortedCards = [...filteredCards];

      if (sortBy) {
        sortedCards.sort((a, b) => {
          switch (sortBy) {
            case "title":
              return (a.title || "").localeCompare(b.title || "");
            case "priority":
              const getPriorityValue = (card: KanbanCard): number => {
                if (card.labels?.includes("High Priority")) return 3;
                if (card.labels?.includes("Medium Priority")) return 2;
                if (card.labels?.includes("Low Priority")) return 1;
                return 0;
              };
              return getPriorityValue(b) - getPriorityValue(a);
            case "dueDate":
              // Fix type errors by handling nullable dates properly
              const aDate = a.dueDate
                ? new Date(a.dueDate).getTime()
                : Number(Infinity);
              const bDate = b.dueDate
                ? new Date(b.dueDate).getTime()
                : Number(Infinity);
              return aDate - bDate;
            case "createdDate":
              return (a.createdAt || 0) - (b.createdAt || 0);
            case "updatedDate":
              return (a.updatedAt || 0) - (b.updatedAt || 0);
            default:
              return 0;
          }
        });
      }

      // Return a new column object with filtered cards
      return {
        ...column,
        cards: sortedCards,
      };
    });
  };

  // Column handlers
  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      dispatch(addColumn({ title: newColumnTitle.trim() }));
      setNewColumnTitle("");
      setIsModalVisible(false);
    }
  };

  const handleUpdateColumn = (columnId: string, title: string) => {
    dispatch(updateColumn({ columnId, title }));
  };

  const handleDeleteColumn = (columnId: string) => {
    dispatch(deleteColumn({ columnId }));
  };

  // Card handlers
  const handleAddCard = (
    columnId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean,
    assignees?: string[]
  ) => {
    dispatch(
      addCard({
        columnId,
        title,
        description,
        labels: labels || [],
        dueDate,
        completed: completed || false,
        assignees: assignees || [],
      })
    );
  };

  const handleEditCard = (
    columnId: string,
    cardId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean,
    assignees?: string[]
  ) => {
    dispatch(
      updateCard({
        columnId,
        cardId,
        title,
        description,
        labels,
        dueDate,
        completed,
        assignees,
      })
    );
  };

  const handleDeleteCard = (columnId: string, cardId: string) => {
    dispatch(deleteCard({ columnId, cardId }));
  };

  const handleUpdateCard = (columnId: string, updatedCard: KanbanCard) => {
    dispatch(
      updateCard({
        columnId,
        cardId: updatedCard.id,
        title: updatedCard.title,
        description: updatedCard.description,
        labels: updatedCard.labels,
        dueDate: updatedCard.dueDate,
        completed: updatedCard.completed,
        assignees: updatedCard.assignees,
      })
    );
  };

  // Placeholder for card click in drag overlay
  const handleCardClick = () => {
    // This is just a placeholder function as the dragged card isn't interactive
  };

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;

    // Determine if dragging a card or column
    if (active.data.current?.type === "card") {
      const columnId = active.data.current.columnId;
      const columnIndex = columns.findIndex((col) => col.id === columnId);
      if (columnIndex !== -1) {
        const cardIndex = columns[columnIndex].cards.findIndex(
          (card) => card.id === id
        );
        if (cardIndex !== -1) {
          setActiveItem({
            id: id as string,
            type: "card",
            card: columns[columnIndex].cards[cardIndex],
            columnId,
          });
        }
      }
    } else if (active.data.current?.type === "column") {
      setActiveItem({
        id: id as string,
        type: "column",
      });
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // This is only needed for complex drag behaviors like card-to-new-column
    // Leave empty for now as we'll handle movement in dragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Do nothing if dropped on itself
    if (activeId === overId) {
      setActiveItem(null);
      return;
    }

    // Handle card movement
    if (active.data.current?.type === "card") {
      const activeColumnId = active.data.current.columnId;
      const activeIndex =
        columns
          .find((col) => col.id === activeColumnId)
          ?.cards.findIndex((card) => card.id === activeId) || 0;

      let overColumnId = activeColumnId;
      let overIndex = 0;

      // Find the drop target
      if (over.data.current?.type === "card") {
        // Dropped on another card
        overColumnId = over.data.current.columnId;
        overIndex =
          columns
            .find((col) => col.id === overColumnId)
            ?.cards.findIndex((card) => card.id === overId) || 0;
      } else if (over.data.current?.type === "column") {
        // Dropped directly on a column
        overColumnId = overId;
        // Place at the end of the column
        overIndex =
          columns.find((col) => col.id === overColumnId)?.cards.length || 0;
      }

      // Only dispatch if there's an actual change
      if (activeColumnId !== overColumnId || activeIndex !== overIndex) {
        dispatch(
          moveCard({
            sourceColumnId: activeColumnId,
            destinationColumnId: overColumnId,
            sourceIndex: activeIndex,
            destinationIndex: overIndex,
            cardId: activeId,
          })
        );
      }
    }

    // Reset active item
    setActiveItem(null);
  };

  // Handle filter changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePriorityFilter = (priorities: string[]) => {
    setPriorityFilter(priorities);
  };

  const handleLabelFilter = (labels: string[]) => {
    setLabelFilter(labels);
  };

  const handleMemberFilter = (members: string[]) => {
    setMemberFilter(members);
  };

  const handleGroupByChange = (value: string) => {
    setGroupBy(value);
    // Implement group by logic as needed
  };

  // Get filtered columns based on current filters
  const filteredColumns = getFilteredColumns();

  return (
    <>
      <div className="board-header">
        <h2>Kanban Board</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Column
        </Button>
      </div>

      <FilterBar
        onSortChange={handleSortChange}
        onPriorityFilter={handlePriorityFilter}
        onLabelFilter={handleLabelFilter}
        onMemberFilter={handleMemberFilter}
        onGroupByChange={handleGroupByChange}
        availableLabels={getAllLabels()}
        availableMembers={getAllMembers()}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Updated board container with horizontal scrolling */}
        <div
          className="kanban-board"
          style={{
            width: "100%",
            overflowX: "auto", // Enable horizontal scrolling
            height: "calc(100% - 120px)", // Leave space for header and filter bar
            padding: "16px 0", // Add some padding for better appearance
            display: "flex", // Use flexbox for horizontal layout
          }}
        >
          <SortableContext
            items={filteredColumns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {/* Modified columns container with nowrap to force horizontal layout */}
            <div
              className="columns-container"
              style={{
                display: "flex",
                flexWrap: "nowrap", // Prevent wrapping to ensure horizontal scrolling
                height: "100%", // Take full height
                paddingRight: "16px", // Add some padding at the end
              }}
            >
              {filteredColumns.map((column) => (
                <div
                  key={column.id}
                  className="column-wrapper"
                  style={{
                    height: "100%", // Take full height to ensure columns are uniform
                    margin: "0 8px",
                    minWidth: "360px", // Ensure minimum width for columns
                  }}
                >
                  <Column
                    column={column}
                    onAddCard={handleAddCard}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                    onEditColumn={handleUpdateColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateCard={handleUpdateCard}
                  />
                </div>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem && activeItem.type === "card" && activeItem.card && (
              <div style={{ width: "300px", opacity: 0.8 }}>
                <KanbanCardComponent
                  card={activeItem.card}
                  onClick={handleCardClick}
                  onUpdateCard={function (_updatedCard: KanbanCard): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            )}
          </DragOverlay>
        </div>
      </DndContext>

      <Modal
        title="Add New Column"
        open={isModalVisible}
        onOk={handleAddColumn}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Column Title">
            <Input
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="Enter column title"
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Board;
