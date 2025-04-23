import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Typography, Dropdown } from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  KanbanColumn as ColumnType,
  KanbanCard as KanbanCardType,
  SubTask,
} from "../types/kanban";
import KanbanCard from "./Card";
import CardForm from "./CardForm";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "../components/ThemeProvider";
import { addSubtask } from "../store/kanbanSlice";

const { Title } = Typography;

// Define a function to get the appropriate header color based on column title
const getColumnHeaderColor = (
  columnTitle: string,
  _theme: "light" | "dark"
): string => {
  const normalizedTitle = columnTitle.toLowerCase().trim();

  if (normalizedTitle === "todo" || normalizedTitle === "to do") {
    return "#d3d3d3"; // lightGray for todo column
  } else if (normalizedTitle === "doing" || normalizedTitle === "in progress") {
    return "#80b3ff"; // blue for doing column
  } else if (normalizedTitle === "done" || normalizedTitle === "completed") {
    return "#c6ecc6"; // green for done column
  } else {
    return "#d3d3d3"; // lightGray for all other columns
  }
};

interface ColumnProps {
  column: ColumnType;
  onAddCard: (
    columnId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean
  ) => void;
  onEditCard: (
    columnId: string,
    cardId: string,
    title: string,
    description: string,
    labels?: string[],
    dueDate?: string,
    completed?: boolean
  ) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onEditColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onUpdateCard: (columnId: string, updatedCard: KanbanCardType) => void;
  headerColor?: string; // Optional prop to override the auto-detected color
}

const Column: React.FC<ColumnProps> = ({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onEditColumn,
  onDeleteColumn,
  onUpdateCard,
  headerColor,
}) => {
  const dispatch = useDispatch();
  const [cardFormVisible, setCardFormVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState<KanbanCardType | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const { theme } = useTheme(); // Use the theme from context

  // Setup droppable for the column
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // Setup sortable for the column itself
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEditCard = (_columnId: string, cardId: string) => {
    const card = column.cards.find((c) => c.id === cardId);
    if (card) {
      setCurrentCard(card);
      setCardFormVisible(true);
    }
  };

  const handleUpdateColumn = () => {
    onEditColumn(column.id, columnTitle);
    setEditingColumnTitle(false);
  };

  // Update Dropdown menu to use items prop
  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: () => setEditingColumnTitle(true),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      onClick: () => onDeleteColumn(column.id),
    },
  ];

  // Get the appropriate header color based on column title
  const headerBgColor =
    headerColor || getColumnHeaderColor(column.title, theme);

  return (
    <div
      ref={setSortableRef}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        width: "360px",
        borderRadius: "6px",
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#f9f9f9",
        boxShadow:
          theme === "dark"
            ? "0 1px 3px rgba(0,0,0,0.3)"
            : "0 1px 3px rgba(0,0,0,0.1)",
        height: "100%", // Take full height of parent
        minHeight: "400px",
        marginRight: "12px",
      }}
    >
      {/* Column header */}
      <div
        className="column-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${theme === "dark" ? "#333" : "#e8e8e8"}`,
          backgroundColor: headerBgColor, // Apply the dynamic header color
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
          flexShrink: 0, // Prevent header from shrinking
        }}
        {...attributes}
        {...listeners}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {editingColumnTitle ? (
            <input
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              autoFocus
              onBlur={handleUpdateColumn}
              onKeyPress={(e) => e.key === "Enter" && handleUpdateColumn()}
              style={{
                marginRight: "8px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: `1px solid ${theme === "dark" ? "#434343" : "#d9d9d9"}`,
                backgroundColor: theme === "dark" ? "#141414" : "#fff",
                color:
                  theme === "dark" ? "rgba(255, 255, 255, 0.85)" : "inherit",
              }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: theme === "dark" ? "#666" : "#eee",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "8px",
                  color: theme === "dark" ? "#fff" : "#555",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {column.cards.length}
              </div>
              <Title
                level={5}
                style={{
                  margin: 0,
                  color: "#333", // Make sure text is always dark on light backgrounds
                  fontWeight: 500,
                }}
              >
                {column.title}
              </Title>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => {
              setCurrentCard(null);
              setCardFormVisible(true);
            }}
            style={{
              marginRight: "8px",
              color: "#333", // Use dark color for better visibility on light backgrounds
            }}
          />
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              size="small"
              style={{
                color: "#333", // Use dark color for better visibility on light backgrounds
              }}
            />
          </Dropdown>
        </div>
      </div>

      {/* Cards container - Updated with overflow-y: auto for vertical scrolling */}
      <div
        ref={setNodeRef}
        className={`kanban-cards-container ${isOver ? "dragging-over" : ""}`}
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto", // Enable vertical scrolling within column
          overflowX: "hidden", // Prevent horizontal scrolling within column
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#f9f9f9",
          borderBottomLeftRadius: "6px",
          borderBottomRightRadius: "6px",
          transition: "background-color 0.2s ease",
          maxHeight: "100%", // Limit height to ensure scrolling
        }}
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card, index) => (
            <KanbanCard
              key={card.id}
              card={card}
              index={index}
              onEdit={handleEditCard}
              onDelete={onDeleteCard}
              columnId={column.id}
              onUpdate={onUpdateCard}
              onAddSubtask={(columnId, cardId, subtask) => {
                dispatch(addSubtask({ columnId, cardId, subtask }));
              }}
            />
          ))}
        </SortableContext>

        {/* Add card button - appears at bottom of list */}
        <Button
          icon={<PlusOutlined />}
          type="text"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "8px",
            color: theme === "dark" ? "rgba(255, 255, 255, 0.65)" : "#666",
            border: `1px dashed ${theme === "dark" ? "#434343" : "#d9d9d9"}`,
            borderRadius: "6px",
            height: "40px",
            backgroundColor: theme === "dark" ? "#262626" : "#fff",
          }}
          onClick={() => {
            setCurrentCard(null);
            setCardFormVisible(true);
          }}
        >
          Add Task
        </Button>
      </div>

      <CardForm
        visible={cardFormVisible}
        initialValues={currentCard || undefined}
        onCancel={() => {
          setCardFormVisible(false);
          setCurrentCard(null);
        }}
        onSubmit={(values) => {
          if (currentCard?.id) {
            onEditCard(
              column.id,
              currentCard.id,
              values.title,
              values.description,
              values.labels,
              values.dueDate,
              values.completed
            );
          } else {
            onAddCard(
              column.id,
              values.title,
              values.description,
              values.labels,
              values.dueDate,
              values.completed
            );
          }
          setCardFormVisible(false);
          setCurrentCard(null);
        }}
      />
    </div>
  );
};

export default Column;
