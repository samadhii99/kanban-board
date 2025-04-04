import React, { useState } from "react";
import {
  Card as AntCard,
  Typography,
  Tag,
  Dropdown,
  Badge,
  Tooltip,
  Avatar,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { KanbanCard } from "../types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardDetailModal from "./CardDetailModal";
import MemberAssignmentModal from "./MemberAssignmentModal.tsx";

const { Title, Paragraph } = Typography;

// Label color mapping
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

// Helper function to determine if due date is past
const isPastDue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};

// Array of colors for avatars
const AVATAR_COLORS = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
  "#1890ff",
  "#52c41a",
  "#722ed1",
  "#eb2f96",
  "#faad14",
  "#13c2c2",
];

// Get display name and initials from email
const getNameFromEmail = (email: string) => {
  // If email contains a name part before @ with a dot separator, use that
  const namePart = email.split("@")[0];

  if (email.includes("@")) {
    // Try to extract name from typical format like john.doe@example.com
    const nameParts = namePart.split(".");
    if (nameParts.length > 1) {
      const firstName =
        nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      const lastName =
        nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
      return {
        displayName: `${firstName} ${lastName}`,
        initials: `${firstName.charAt(0)}${lastName.charAt(0)}`,
      };
    }
  }

  // Just capitalize the name part and use first letter as initial
  const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  return {
    displayName: capitalized,
    initials: namePart.charAt(0).toUpperCase(),
  };
};

// Mock database of team members (in a real app, you'd fetch this from API)
const TEAM_MEMBERS = [
  { email: "john@example.com", name: "John Doe" },
  { email: "jane@example.com", name: "Jane Smith" },
  { email: "michael@example.com", name: "Michael Brown" },
  { email: "emily@example.com", name: "Emily Johnson" },
  { email: "david@example.com", name: "David Wilson" },
];

// Find member name by email
const getMemberNameByEmail = (email: string): string => {
  const member = TEAM_MEMBERS.find((m) => m.email === email);
  return member ? member.name : getNameFromEmail(email).displayName;
};

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
  return getNameFromEmail(email).initials;
};

interface CardProps {
  card: KanbanCard;
  index: number;
  columnId: string;
  onEdit: (columnId: string, cardId: string) => void;
  onDelete: (columnId: string, cardId: string) => void;
  onUpdate: (columnId: string, updatedCard: KanbanCard) => void;
}

const Card: React.FC<CardProps> = ({
  card,
  index,
  columnId,
  onEdit,
  onDelete,
  onUpdate,
}) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);

  // Setup sortable for the card
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Updated dropdown menu items
  const menuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: (e: { domEvent: { stopPropagation: () => void } }) => {
        e.domEvent.stopPropagation();
        onEdit(columnId, card.id);
      },
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      onClick: (e: { domEvent: { stopPropagation: () => void } }) => {
        e.domEvent.stopPropagation();
        onDelete(columnId, card.id);
      },
    },
  ];

  const formatDueDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleToggleComplete = () => {
    onUpdate(columnId, {
      ...card,
      completed: !card.completed,
    });
  };

  // Handle click stopPropagation
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Fixed handler that accepts optional parameter
  const handleMemberClick = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.stopPropagation(); // Prevent card details modal from opening
    }
    setMemberModalVisible(true);
  };

  // Handle member assignment
  const handleMemberAssignment = (members: string[]) => {
    onUpdate(columnId, {
      ...card,
      assignees: members,
    });
    setMemberModalVisible(false);
  };

  // Render avatars for assignees - UPDATED FUNCTION
  const renderAssigneeAvatars = () => {
    // Create container regardless of whether there are assignees
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          marginTop: "8px",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent card modal from opening
      >
        {card.assignees && card.assignees.length > 0 ? (
          <Avatar.Group
            maxCount={3}
            maxStyle={{
              color: "#f56a00",
              backgroundColor: "#fde3cf",
              cursor: "pointer",
            }}
          >
            {card.assignees.slice(0, 3).map((email, index) => (
              <Tooltip key={index} title={getMemberNameByEmail(email)}>
                <Avatar
                  style={{
                    backgroundColor:
                      AVATAR_COLORS[index % AVATAR_COLORS.length],
                    cursor: "pointer",
                  }}
                  onClick={handleMemberClick}
                >
                  {getMemberInitial(email)}
                </Avatar>
              </Tooltip>
            ))}
            {card.assignees.length > 3 && (
              <Tooltip title={`${card.assignees.length - 3} more member(s)`}>
                <Avatar
                  style={{
                    backgroundColor: "#ccc",
                    cursor: "pointer",
                  }}
                  onClick={handleMemberClick}
                >
                  +{card.assignees.length - 3}
                </Avatar>
              </Tooltip>
            )}
          </Avatar.Group>
        ) : null}

        {/* Always render the "Add Members" button */}
        <Tooltip title="Add Members">
          <Avatar
            icon={<UserOutlined />}
            style={{
              cursor: "pointer",
              backgroundColor: "#f0f0f0",
              color: "#999",
            }}
            onClick={(e) => {
              e?.stopPropagation();
              setMemberModalVisible(true);
            }}
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={`draggable ${isDragging ? "dragging" : ""}`}
        style={{
          ...style,
          userSelect: "none", // Prevent text selection while dragging
          marginBottom: "10px",
        }}
        {...attributes}
        {...listeners}
      >
        <AntCard
          className={`kanban-card ${card.completed ? "completed-card" : ""}`}
          onClick={() => setDetailModalVisible(true)}
          extra={
            <div style={{ display: "flex", gap: "8px" }}>
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <span onClick={handleDropdownClick}>
                  <MoreOutlined style={{ cursor: "pointer" }} />
                </span>
              </Dropdown>
            </div>
          }
        >
          <Title level={5}>{card.title}</Title>
          {card.description && (
            <Paragraph ellipsis={{ rows: 2 }}>{card.description}</Paragraph>
          )}

          {/* Render assignee avatars */}
          {renderAssigneeAvatars()}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {card.labels?.map((label, idx) => (
                <Tag key={idx} color={getLabelColor(label)}>
                  {label}
                </Tag>
              ))}
            </div>

            {card.dueDate && (
              <Badge
                status={
                  card.completed
                    ? "success"
                    : isPastDue(card.dueDate)
                    ? "error"
                    : "processing"
                }
                text={
                  <span style={{ fontSize: "12px" }}>
                    <CalendarOutlined /> {formatDueDate(card.dueDate)}
                  </span>
                }
              />
            )}
          </div>
        </AntCard>
      </div>

      <CardDetailModal
        visible={detailModalVisible}
        card={card}
        columnId={columnId}
        onCancel={() => setDetailModalVisible(false)}
        onUpdate={onUpdate}
        onToggleComplete={handleToggleComplete}
      />

      <MemberAssignmentModal
        visible={memberModalVisible}
        onCancel={() => setMemberModalVisible(false)}
        onSubmit={handleMemberAssignment}
        currentMembers={card.assignees || []}
      />
    </>
  );
};

export default Card;
