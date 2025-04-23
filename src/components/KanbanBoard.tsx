import React from "react";
import { useDispatch } from "react-redux";
import { Card, Typography, Tag, Avatar, Button } from "antd";
import {
  EllipsisOutlined,
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { updateCard } from "../store/kanbanSlice";

const { Title } = Typography;

// Define types for your data
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  labels?: string[];
  assignees?: string[];
  dueDate?: string;
  completed?: boolean;
  subtasks?: Subtask[];
}

interface KanbanColumn {
  id: string;
  title: string;
  count: number;
  cards: KanbanCard[];
}

// Mock data for demonstration (you'll likely replace this with Redux state)
const mockColumns: KanbanColumn[] = [
  {
    id: "col1",
    title: "To Do",
    count: 1,
    cards: [
      {
        id: "card1",
        title: "Data Inventory and Classification",
        labels: ["Development"],
        assignees: ["john@example.com"],
        dueDate: "2023-10-21",
        completed: false,
        subtasks: [
          { id: "st1", title: "Create data schema", completed: false },
          { id: "st2", title: "Implement classification", completed: false },
        ],
      },
    ],
  },
  {
    id: "col2",
    title: "Doing",
    count: 4,
    cards: [
      {
        id: "card2",
        title: "Data Leakage Detection",
        labels: ["Feature"],
        assignees: ["jane@example.com"],
        completed: false,
      },
      {
        id: "card3",
        title: "Data Masking and Encryption",
        labels: ["Maintenance"],
        assignees: ["michael@example.com"],
        completed: false,
      },
      {
        id: "card4",
        title: "Bug Prioritization",
        labels: ["Awaiting review"],
        assignees: ["emily@example.com", "david@example.com"],
        completed: false,
      },
      {
        id: "card5",
        title: "Bug Assignment",
        labels: ["UI/UX Bug", "Regression"],
        assignees: [],
        completed: false,
      },
    ],
  },
  {
    id: "col3",
    title: "Done",
    count: 4,
    cards: [
      {
        id: "card6",
        title: "Data Loss Prevention (DLP) Policies",
        labels: ["QA"],
        assignees: ["jane@example.com"],
        completed: true,
      },
      {
        id: "card7",
        title: "Bug Closure",
        labels: ["Ready for Dev"],
        assignees: ["emily@example.com", "david@example.com"],
        completed: true,
      },
      {
        id: "card8",
        title: "Documentation",
        labels: ["Fixed", "Fixing"],
        assignees: ["emily@example.com", "david@example.com"],
        completed: true,
      },
      {
        id: "card9",
        title: "Reporting",
        labels: ["Documentation"],
        assignees: [],
        completed: true,
      },
    ],
  },
];

// Label color mapping
const getLabelColor = (label: string): string => {
  if (label === "Development") return "green";
  if (label === "Feature") return "pink";
  if (label === "Maintenance") return "gold";
  if (label === "Awaiting review") return "brown";
  if (label === "UI/UX Bug") return "lime";
  if (label === "Regression") return "volcano";
  if (label === "QA") return "blue";
  if (label === "Ready for Dev") return "geekblue";
  if (label === "Fixed") return "gray";
  if (label === "Fixing") return "green";
  if (label === "Documentation") return "purple";
  return "default";
};

// Get initials from email
const getInitials = (email: string): string => {
  if (!email) return "";
  const namePart = email.split("@")[0];
  const parts = namePart.split(".");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return namePart[0].toUpperCase();
};

// Avatar colors
const AVATAR_COLORS: string[] = [
  "#1677ff", // Primary blue
  "#f5222d", // Red
  "#722ed1", // Purple
  "#13c2c2", // Cyan
  "#52c41a", // Green
];

interface KanbanCardProps {
  card: KanbanCard;
  columnId: string;
  onUpdate: (columnId: string, updatedCard: KanbanCard) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  columnId,
  onUpdate,
}) => {
  const handleCardClick = () => {
    // This could open a modal for editing - not implemented here
    // For now, just a simple update example
    const updatedCard = {
      ...card,
      title: `Updated: ${card.title}`,
      // Update other fields as needed
    };
    onUpdate(columnId, updatedCard);
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 8,
        borderRadius: 6,
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
      bodyStyle={{ padding: "12px 16px" }}
      onClick={handleCardClick}
    >
      {/* Card header with label */}
      <div style={{ marginBottom: 8 }}>
        {card.labels &&
          card.labels.map((label, index) => (
            <Tag
              key={index}
              color={getLabelColor(label)}
              style={{
                borderRadius: 4,
                fontSize: "12px",
                padding: "0 8px",
                marginRight: 4,
              }}
            >
              {label}
            </Tag>
          ))}
      </div>

      {/* Card title */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Title
          level={5}
          style={{
            fontSize: "14px",
            margin: 0,
            lineHeight: "20px",
            fontWeight: 500,
            color: "#303030",
            textDecoration: card.completed ? "line-through" : "none",
          }}
        >
          <span
            style={{
              borderLeft: "3px solid #faad14",
              paddingLeft: 8,
              display: "block",
            }}
          >
            {card.title}
          </span>
        </Title>
        <Button
          type="text"
          icon={<EllipsisOutlined />}
          size="small"
          style={{ marginRight: -8 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            // Handle options menu here
          }}
        />
      </div>

      {/* Subtasks (if any) */}
      {card.subtasks && card.subtasks.length > 0 && (
        <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
          {card.subtasks.filter((st) => st.completed).length} of{" "}
          {card.subtasks.length} subtasks
        </div>
      )}

      {/* Card footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          alignItems: "center",
        }}
      >
        {/* Avatar group */}
        <div>
          <Avatar.Group maxCount={3} size="small">
            {card.assignees &&
              card.assignees.map((email, idx) => (
                <Avatar
                  key={idx}
                  size="small"
                  style={{
                    backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                    fontSize: "11px",
                  }}
                >
                  {getInitials(email)}
                </Avatar>
              ))}
            {(!card.assignees || card.assignees.length === 0) && (
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{ backgroundColor: "#f0f0f0", color: "#999" }}
              />
            )}
          </Avatar.Group>
        </div>

        {/* Due date */}
        {card.dueDate && (
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {new Date(card.dueDate).toLocaleDateString()}
          </div>
        )}

        {/* Comments/attachments count */}
        {card.id && (
          <div
            style={{
              fontSize: "12px",
              color: "#8c8c8c",
              display: "flex",
              gap: 4,
            }}
          >
            <span>
              {card.id === "card1" ? "3" : card.id === "card2" ? "2" : "0"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

interface KanbanColumnProps {
  column: KanbanColumn;
  onUpdateCard: (columnId: string, updatedCard: KanbanCard) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  onUpdateCard,
}) => {
  // Column color based on title
  const getColumnColor = (title: string): string => {
    if (title === "To Do") return "#f0f0f0";
    if (title === "Doing") return "#e6f4ff";
    if (title === "Done") return "#f6ffed";
    return "#f0f0f0";
  };

  return (
    <div
      style={{
        width: "calc(33.33% - 16px)",
        margin: "0 8px",
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #e8e8e8",
        overflow: "hidden",
      }}
    >
      {/* Column header */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: getColumnColor(column.title),
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              background: "#1677ff",
              color: "white",
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            {column.count}
          </div>
          <span style={{ fontWeight: 500 }}>{column.title}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<PlusOutlined />} type="text" size="small" />
          <Button icon={<EllipsisOutlined />} type="text" size="small" />
        </div>
      </div>

      {/* Column content */}
      <div style={{ padding: 8, maxHeight: "70vh", overflow: "auto" }}>
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            columnId={column.id}
            onUpdate={onUpdateCard}
          />
        ))}

        {/* Add task button - only shown in first column */}
        {column.id === "col1" && (
          <Button
            block
            type="dashed"
            icon={<PlusOutlined />}
            style={{ marginTop: 8 }}
          >
            Add Task
          </Button>
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();

  // In a real app, you'd get the columns from Redux state using useSelector
  // const columns = useSelector((state: RootState) => state.kanban.columns);
  const columns = mockColumns; // Using mock data for now

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
        subtasks: updatedCard.subtasks,
      })
    );
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "16px",
        background: "#f5f5f5",
        minHeight: "90vh",
      }}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          onUpdateCard={handleUpdateCard}
        />
      ))}

      {/* Add section button */}
      <div
        style={{
          margin: "0 8px",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <Button
          icon={<PlusOutlined />}
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          Add Section
        </Button>
      </div>
    </div>
  );
};

export default KanbanBoard;
