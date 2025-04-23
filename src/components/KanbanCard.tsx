import React, { useState } from "react";
import {
  Card as AntCard,
  Typography,
  Tag,
  Avatar,
  Tooltip,
  Button,
} from "antd";
import {
  MoreOutlined,
  CalendarOutlined,
  UserOutlined,
  PlusOutlined,
  PauseOutlined,
  ForkOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { KanbanCard } from "../types/kanban";

const { Title } = Typography;

// Get background color for label
const getLabelBackground = (label: string): string => {
  if (label.includes("Development")) return "#ecf8ee";
  if (label.includes("Feature")) return "#fbe9e9";
  if (label.includes("Maintenance")) return "#fef8e7";
  if (label.includes("Bug")) return "#f5f5f5";
  if (label.includes("UI/UX Bug")) return "#fef8e7";
  if (label.includes("Awaiting review")) return "#f5f0e6";
  return "#f5f5f5";
};

// Get text color for label
const getLabelTextColor = (label: string): string => {
  if (label.includes("Development")) return "#52c41a";
  if (label.includes("Feature")) return "#f5222d";
  if (label.includes("Maintenance")) return "#faad14";
  if (label.includes("Bug")) return "#555555";
  if (label.includes("UI/UX Bug")) return "#d4b106";
  if (label.includes("Awaiting review")) return "#ad6800";
  return "#555555";
};

// Array of colors for avatars
const AVATAR_COLORS = [
  "#f56a00",
  "#7265e6",
  "#1677ff",
  "#52c41a",
  "#722ed1",
  "#eb2f96",
];

// Mock database of team members
const TEAM_MEMBERS = [
  { email: "john@example.com", name: "John Doe" },
  { email: "jane@example.com", name: "Jane Smith" },
  { email: "michael@example.com", name: "Michael Brown" },
  { email: "emily@example.com", name: "Emily Johnson" },
  { email: "david@example.com", name: "David Wilson" },
];

// Get member initial for avatar
const getMemberInitial = (email: string): string => {
  const member = TEAM_MEMBERS.find((m) => m.email === email);
  if (member) {
    const nameParts = member.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return member.name[0].toUpperCase();
  }

  // If no member found, use email
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase();
};

// Format the date to display properly
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

interface CardProps {
  card: KanbanCard;
  onClick?: () => void;
  onUpdateCard: (updatedCard: KanbanCard) => void;
}

const KanbanCardComponent: React.FC<CardProps> = ({
  card,
  onClick,
  onUpdateCard,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Using a different approach for theme
  // We'll define constant values for light and dark themes
  // and use string comparison instead of direct comparison
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";

  // The theme value - replace this with your actual theme source
  const currentTheme = THEME_LIGHT; // Or get from context/props

  // Helper function to check if theme is dark
  const isDark = () => currentTheme === THEME_DARK;

  // Determine avatar display based on email or initial
  const getAvatar = (email: string, index: number) => {
    // Check if it's a single character (like "E" or "S")
    if (email.length === 1) {
      return (
        <Avatar
          key={index}
          style={{
            backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
          }}
        >
          {email}
        </Avatar>
      );
    }

    // Otherwise treat as email and get initials
    return (
      <Avatar
        key={index}
        style={{
          backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
        }}
      >
        {getMemberInitial(email)}
      </Avatar>
    );
  };

  // Handler for avatar click - Fixed type issue by making parameter optional
  const handleAvatarClick = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.stopPropagation(); // This stops the event from bubbling up
    }
    // Handle member assignment here
    console.log("Avatar clicked");
  };

  // Toggle subtask completion
  const toggleSubtaskCompletion = (subtaskId: string) => {
    if (!card.subtasks) return;

    const updatedSubtasks = card.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    const updatedCard = {
      ...card,
      subtasks: updatedSubtasks,
    };

    // Calculate and update percentage
    const completedCount = updatedSubtasks.filter((st) => st.completed).length;
    const percentage =
      updatedSubtasks.length > 0
        ? Math.round((completedCount / updatedSubtasks.length) * 100)
        : 0;

    updatedCard.percentage = percentage;

    onUpdateCard(updatedCard);
  };

  const mainLabel = card.labels && card.labels.length > 0 ? card.labels[0] : "";
  const percentage = card.percentage !== undefined ? card.percentage : 0;

  return (
    <AntCard
      className="kanban-card"
      onClick={onClick}
      style={{
        borderRadius: "8px",
        backgroundColor: isDark() ? "#262626" : "#ffffff",
        border: `1px solid ${isDark() ? "#424242" : "#e9e9e9"}`,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
        padding: 0,
        overflow: "hidden",
        marginBottom: "12px",
      }}
      bodyStyle={{
        padding: 0,
      }}
    >
      {/* Card Header with Tag and Actions */}
      <div style={{ padding: "16px 16px 12px 16px" }}>
        {/* Card Label and Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {/* Primary Label Tag */}
          {mainLabel && (
            <Tag
              style={{
                borderRadius: "4px",
                padding: "2px 8px",
                marginRight: 0,
                backgroundColor: getLabelBackground(mainLabel),
                color: getLabelTextColor(mainLabel),
                border: "none",
              }}
            >
              {mainLabel}
            </Tag>
          )}

          {/* Progress Percentage */}
          <div
            style={{
              fontSize: "12px",
              color: isDark()
                ? "rgba(255, 255, 255, 0.45)"
                : "rgba(0, 0, 0, 0.45)",
            }}
          >
            {percentage}%
          </div>
        </div>

        {/* Card Title with color accent line */}
        <div style={{ display: "flex", marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              marginRight: "8px",
              color: "#faad14",
            }}
          >
            <PauseOutlined
              style={{
                color: "#faad14",
                transform: "rotate(90deg)",
                marginRight: "0.25rem",
              }}
            />
          </div>
          <Title
            level={5}
            style={{
              fontSize: "14px",
              fontWeight: 500,
              margin: 0,
              flex: 1,
              color: isDark() ? "rgba(255, 255, 255, 0.85)" : undefined,
            }}
          >
            {card.title}
          </Title>
        </div>

        {/* Assignees and Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Assignees */}
          <div onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
            <Avatar.Group maxCount={3} size="small">
              {card.assignees &&
                card.assignees.map((assignee, idx) => getAvatar(assignee, idx))}
              {(!card.assignees || card.assignees.length === 0) && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#f0f0f0", color: "#999" }}
                  size="small"
                />
              )}
            </Avatar.Group>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Calendar Icon with Due Date */}
            {card.dueDate && (
              <Tooltip title="Due Date">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "12px",
                    fontSize: "12px",
                    color: isDark()
                      ? "rgba(255, 255, 255, 0.65)"
                      : "rgba(0, 0, 0, 0.65)",
                  }}
                >
                  <CalendarOutlined style={{ marginRight: "4px" }} />
                  {formatDate(card.dueDate)}
                </div>
              </Tooltip>
            )}

            {/* More Actions */}
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                color: isDark() ? "rgba(255, 255, 255, 0.45)" : undefined,
                padding: "0 4px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Subtasks Section Toggle */}
      <div
        style={{
          borderTop: `1px solid ${isDark() ? "#424242" : "#f0f0f0"}`,
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          backgroundColor: isDark() ? "#1f1f1f" : "#fafafa",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowSubtasks(!showSubtasks);
        }}
      >
        <div
          style={{
            fontWeight: 500,
            fontSize: "12px",
            color: isDark()
              ? "rgba(255, 255, 255, 0.85)"
              : "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ForkOutlined
            rotate={90}
            style={{ marginRight: "6px", fontSize: "10px" }}
          />
          Subtasks
        </div>
        <CaretDownOutlined
          style={{
            transform: showSubtasks ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
            fontSize: "12px",
            color: isDark()
              ? "rgba(255, 255, 255, 0.45)"
              : "rgba(0, 0, 0, 0.45)",
          }}
        />
      </div>

      {/* Subtasks List */}
      {showSubtasks && (
        <div
          style={{
            padding: "0",
            backgroundColor: isDark() ? "#262626" : "#fff",
          }}
        >
          {card.subtasks && card.subtasks.length > 0 ? (
            card.subtasks.map((subtask, idx) => (
              <div
                key={subtask.id}
                style={{
                  padding: "10px 16px",
                  borderTop: `1px solid ${isDark() ? "#424242" : "#f0f0f0"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubtaskCompletion(subtask.id);
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 400,
                    textDecoration: subtask.completed ? "line-through" : "none",
                    color: subtask.completed ? "#8c8c8c" : "inherit",
                  }}
                >
                  {subtask.title}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {subtask.dueDate && (
                    <div
                      style={{
                        fontSize: "12px",
                        marginRight: "8px",
                        color: isDark()
                          ? "rgba(255, 255, 255, 0.45)"
                          : "rgba(0, 0, 0, 0.45)",
                      }}
                    >
                      {formatDate(subtask.dueDate)}
                    </div>
                  )}
                  {subtask.assignee && (
                    <Avatar
                      size="small"
                      style={{
                        backgroundColor:
                          AVATAR_COLORS[idx % AVATAR_COLORS.length],
                        cursor: "pointer",
                      }}
                      onClick={handleAvatarClick}
                    >
                      {getMemberInitial(subtask.assignee)}
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "16px",
                textAlign: "center",
                color: "#8c8c8c",
                fontSize: "13px",
              }}
            >
              No subtasks yet
            </div>
          )}

          {/* Add Subtask Button */}
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${isDark() ? "#424242" : "#f0f0f0"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isDark() ? "#1677ff" : "#1677ff",
            }}
            onClick={(e) => {
              e.stopPropagation();
              // Handle adding subtask here
              console.log("Add subtask clicked");
            }}
          >
            <PlusOutlined style={{ fontSize: "12px", marginRight: "4px" }} />
            <span style={{ fontSize: "13px" }}>Add Subtask</span>
          </div>
        </div>
      )}
    </AntCard>
  );
};

export default KanbanCardComponent;
