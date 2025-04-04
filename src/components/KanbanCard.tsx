import React from "react";
import { Card, Tag, Typography } from "antd";
import { CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { KanbanCard } from "../types/kanban";

const { Text } = Typography;

interface KanbanCardProps {
  card: KanbanCard;
  onClick: () => void;
}

// Same label color mapping as in the modal
const getLabelColor = (label: string): string => {
  // Priority labels
  if (label.includes("High Priority")) return "red";
  if (label.includes("Medium Priority")) return "orange";
  if (label.includes("Low Priority")) return "green";

  // Type labels
  if (label.includes("Bug")) return "volcano";
  if (label.includes("Feature")) return "geekblue";
  if (label.includes("Enhancement")) return "purple";
  if (label.includes("Documentation")) return "cyan";

  // Area labels
  if (label.includes("Frontend")) return "magenta";
  if (label.includes("Backend")) return "blue";
  if (label.includes("UI/UX")) return "pink";
  if (label.includes("Testing")) return "gold";

  // Language labels
  if (label.startsWith("Language:")) return "lime";

  // Default color for any other labels
  return "default";
};

const KanbanCardComponent: React.FC<KanbanCardProps> = ({ card, onClick }) => {
  const isPastDue = (dueDate: string | undefined): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card
      size="small"
      title={card.title}
      className={`kanban-card ${card.completed ? "completed-card" : ""}`}
      onClick={onClick}
      extra={
        card.completed && <CheckCircleOutlined style={{ color: "#52c41a" }} />
      }
    >
      {card.labels && card.labels.length > 0 && (
        <div className="card-labels-container">
          {card.labels.map((label, index) => (
            <Tag key={index} color={getLabelColor(label)}>
              {label}
            </Tag>
          ))}
        </div>
      )}

      {card.description && (
        <Text
          type="secondary"
          ellipsis={true}
          style={{ marginTop: 8, display: "block" }}
        >
          {card.description}
        </Text>
      )}

      {card.dueDate && (
        <div style={{ marginTop: 8 }}>
          <Tag
            color={isPastDue(card.dueDate) && !card.completed ? "red" : "blue"}
            style={{ marginRight: 0 }}
          >
            <CalendarOutlined /> {formatDueDate(card.dueDate)}
          </Tag>
        </div>
      )}
    </Card>
  );
};

export default KanbanCardComponent;
