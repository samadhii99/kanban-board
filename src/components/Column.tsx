import React, { useState } from "react";
import { Card, Button, Typography, Dropdown } from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  KanbanColumn as ColumnType,
  KanbanCard as KanbanCardType,
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

const { Title } = Typography;

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
}

const Column: React.FC<ColumnProps> = ({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onEditColumn,
  onDeleteColumn,
  onUpdateCard,
}) => {
  const [cardFormVisible, setCardFormVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState<KanbanCardType | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  // Setup droppable for the column
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // Setup sortable for the column itself (if you want to allow column reordering)
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

  return (
    <Card
      className={`kanban-column ${isOver ? "dragging-over" : ""}`}
      ref={setSortableRef}
      style={{
        ...style,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      title={
        <div
          style={{ display: "flex", alignItems: "center", width: "100%" }}
          {...attributes}
          {...listeners}
        >
          {editingColumnTitle ? (
            <>
              <input
                value={columnTitle}
                onChange={(e) => setColumnTitle(e.target.value)}
                autoFocus
                onBlur={handleUpdateColumn}
                onKeyPress={(e) => e.key === "Enter" && handleUpdateColumn()}
                style={{ flexGrow: 1, marginRight: 8 }}
              />
              <Button size="small" type="primary" onClick={handleUpdateColumn}>
                Save
              </Button>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Title level={5} style={{ margin: 0 }}>
                {column.title}
              </Title>
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Button type="text" icon={<EllipsisOutlined />} />
              </Dropdown>
            </div>
          )}
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentCard(null);
            setCardFormVisible(true);
          }}
        >
          Add Card
        </Button>
      }
      bodyStyle={{ flex: 1, overflow: "auto", padding: "12px" }}
    >
      <div
        ref={setNodeRef}
        className={`kanban-cards-container ${isOver ? "dragging-over" : ""}`}
        style={{
          height: "100%",
          minHeight: "50px",
          transition: "background-color 0.2s ease",
          backgroundColor: isOver ? "rgba(0,0,0,0.05)" : "transparent",
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
            />
          ))}
        </SortableContext>
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
    </Card>
  );
};

export default Column;
