import React, { useState, useEffect } from "react";
import {
  Card as AntCard,
  Typography,
  Tag,
  Dropdown,
  Avatar,
  Tooltip,
  Button,
  Popover,
  DatePicker,
} from "antd";
import {
  MoreOutlined,
  CalendarOutlined,
  UserOutlined,
  PauseOutlined,
  ForkOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { KanbanCard, SubTask } from "../types/kanban";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardDetailDrawer from "./CardDetailDrawer";
import MemberAssignmentModal from "./MemberAssignmentModal";
import SubtaskSection from "./SubtaskSection";
import { useTheme } from "../components/ThemeProvider";
import moment from "moment";
import {
  AVATAR_COLORS,
  TEAM_MEMBERS,
  getLabelBackground,
  getLabelTextColor,
  getMemberInitial,
  formatDate,
} from "../constants/kanbanConstants";

const { Title, Text } = Typography;

interface CardProps {
  card: KanbanCard & {
    subtasks?: SubTask[];
    label?: string;
    percentage?: number;
  };
  index: number;
  columnId: string;
  onEdit: (columnId: string, cardId: string) => void;
  onDelete: (columnId: string, cardId: string) => void;
  onUpdate: (columnId: string, updatedCard: KanbanCard) => void;
  onAddSubtask?: (columnId: string, cardId: string, subtask: SubTask) => void;
}

const Card: React.FC<CardProps> = ({
  card,
  columnId,
  onEdit,
  onDelete,
  onUpdate,
  onAddSubtask,
}) => {
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [calendarPopoverVisible, setCalendarPopoverVisible] = useState(false);
  const { theme } = useTheme();

  // Add local state to ensure UI updates even if parent doesn't re-render
  const [localSubtasks, setLocalSubtasks] = useState<SubTask[]>(
    card.subtasks || []
  );

  // Sync localSubtasks with card.subtasks when card changes
  useEffect(() => {
    setLocalSubtasks(card.subtasks || []);
  }, [card]);

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

  const onDropdownClick: MenuProps["onClick"] = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    if (key === "edit") {
      onEdit(columnId, card.id);
    } else if (key === "delete") {
      onDelete(columnId, card.id);
    }
  };

  const menuItems: MenuProps["items"] = [
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
  ];

  const getAvatar = (email: string, index: number) => (
    <Avatar
      key={index}
      style={{
        backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      }}
    >
      {getMemberInitial(email)}
    </Avatar>
  );

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMemberModalVisible(true);
  };

  const handleSubtaskAvatarClick = (
    e: React.MouseEvent<Element, MouseEvent>
  ) => {
    e.stopPropagation();
    setMemberModalVisible(true);
  };

  const handleAddSubtask = (newSubtask: SubTask) => {
    console.log("Adding subtask:", newSubtask);

    // Update local state first for immediate UI feedback
    const updatedSubtasks = [...localSubtasks, newSubtask];
    setLocalSubtasks(updatedSubtasks);

    // Calculate completion percentage
    const completedCount = updatedSubtasks.filter((st) => st.completed).length;
    const percentage =
      updatedSubtasks.length > 0
        ? Math.round((completedCount / updatedSubtasks.length) * 100)
        : 0;

    // Create a properly deep-copied updated card object
    const updatedCard = {
      ...card,
      subtasks: updatedSubtasks,
      percentage,
    };

    console.log("Updating card with subtasks:", updatedCard.subtasks);

    // Call onUpdate with the updated card
    onUpdate(columnId, updatedCard);

    // Directly dispatch the addSubtask action if provided
    if (onAddSubtask) {
      onAddSubtask(columnId, card.id, newSubtask);
    }
  };

  const handleToggleSubtaskCompletion = (subtaskId: string) => {
    console.log("Toggling subtask completion:", subtaskId);

    // Update local state first
    const updatedLocalSubtasks = localSubtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    setLocalSubtasks(updatedLocalSubtasks);

    // Calculate completion percentage
    const completedCount = updatedLocalSubtasks.filter(
      (st) => st.completed
    ).length;
    const percentage =
      updatedLocalSubtasks.length > 0
        ? Math.round((completedCount / updatedLocalSubtasks.length) * 100)
        : 0;

    const updatedCard = {
      ...card,
      subtasks: updatedLocalSubtasks,
      percentage,
    };

    onUpdate(columnId, updatedCard);
  };

  // Handler for date selection
  const handleDateChange = (date: moment.Moment | null) => {
    const dueDate = date ? date.toISOString() : undefined;
    onUpdate(columnId, { ...card, dueDate });
    setCalendarPopoverVisible(false);
  };

  // New handler for subtask icon click
  const handleSubtaskIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSubtasks(!showSubtasks);
  };

  const percentage = card.percentage ?? 0;
  const subtaskCount = localSubtasks.length;

  // Simple date picker without buttons
  const datePickerContent = (
    <DatePicker
      defaultValue={card.dueDate ? moment(card.dueDate) : undefined}
      onChange={handleDateChange}
      allowClear
      format="YYYY-MM-DD"
      onClick={(e) => e.stopPropagation()}
    />
  );

  return (
    <>
      <div
        ref={setNodeRef}
        className={`draggable ${isDragging ? "dragging" : ""}`}
        style={{
          ...style,
          userSelect: "none",
          marginBottom: "12px",
        }}
        {...attributes}
        {...listeners}
      >
        <AntCard
          className="kanban-card"
          onClick={() => setDetailDrawerVisible(true)}
          style={{
            borderRadius: "8px",
            backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
            border: `1px solid ${theme === "dark" ? "#424242" : "#e9e9e9"}`,
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            padding: 0,
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: "16px 16px 12px 16px" }}>
            {/* Updated label display section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1px",
                  maxWidth: "80%",
                }}
              >
                {card.labels?.map((label, index) => (
                  <Tag
                    key={index}
                    style={{
                      borderRadius: "4px",
                      padding: "2px 8px",
                      backgroundColor: getLabelBackground(label),
                      color: getLabelTextColor(label),
                      border: "none",
                      marginBottom: "4px",
                    }}
                  >
                    {label}
                  </Tag>
                ))}
                {!card.labels?.length && card.label && (
                  <Tag
                    style={{
                      borderRadius: "4px",
                      padding: "2px 8px",
                      backgroundColor: getLabelBackground(card.label),
                      color: getLabelTextColor(card.label),
                      border: "none",
                    }}
                  >
                    {card.label}
                  </Tag>
                )}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color:
                    theme === "dark"
                      ? "rgba(255, 255, 255, 0.45)"
                      : "rgba(0, 0, 0, 0.45)",
                }}
              >
                {percentage}%
              </div>
            </div>

            <div style={{ display: "flex", marginBottom: "12px" }}>
              <PauseOutlined
                style={{
                  color: "#faad14",
                  transform: "rotate(90deg)",
                  marginRight: "0.25rem",
                }}
              />
              <Title
                level={5}
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  margin: 0,
                  flex: 1,
                  color:
                    theme === "dark" ? "rgba(255, 255, 255, 0.85)" : undefined,
                }}
              >
                {card.title}
              </Title>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div onClick={handleAvatarClick} style={{ cursor: "pointer" }}>
                <Avatar.Group maxCount={3} size="small">
                  {card.assignees?.map((assignee, idx) =>
                    getAvatar(assignee, idx)
                  )}
                  {!card.assignees?.length && (
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#f0f0f0", color: "#999" }}
                      size="small"
                    />
                  )}
                </Avatar.Group>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Simplified popover with just the DatePicker */}
                <Popover
                  content={datePickerContent}
                  trigger="click"
                  open={calendarPopoverVisible}
                  onOpenChange={(visible) => {
                    setCalendarPopoverVisible(visible);
                  }}
                  placement="bottom"
                  destroyTooltipOnHide={true}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "12px",
                      fontSize: "12px",
                      color:
                        theme === "dark"
                          ? "rgba(255, 255, 255, 0.65)"
                          : "rgba(0, 0, 0, 0.65)",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                    }}
                  >
                    <CalendarOutlined style={{ marginRight: "4px" }} />
                    {card.dueDate ? formatDate(card.dueDate) : "Add date"}
                  </div>
                </Popover>

                <Tooltip title="Click to show/hide subtasks">
                  <Tag
                    style={{
                      marginRight: "8px",
                      background:
                        theme === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "#f5f5f5",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0 6px",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={handleSubtaskIconClick}
                  >
                    <ForkOutlined
                      rotate={90}
                      style={{ marginRight: "4px", fontSize: "10px" }}
                    />
                    <Text
                      style={{
                        color:
                          theme === "dark"
                            ? "rgba(255, 255, 255, 0.65)"
                            : undefined,
                      }}
                    >
                      {subtaskCount}
                    </Text>
                  </Tag>
                </Tooltip>

                <Dropdown
                  menu={{ items: menuItems, onClick: onDropdownClick }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color:
                        theme === "dark"
                          ? "rgba(255, 255, 255, 0.45)"
                          : undefined,
                      padding: "0 4px",
                    }}
                  />
                </Dropdown>
              </div>
            </div>
          </div>

          {showSubtasks && (
            <SubtaskSection
              subtasks={localSubtasks}
              onAddSubtask={handleAddSubtask}
              onSubtaskClick={(e: React.MouseEvent) => e.stopPropagation()}
              onAvatarClick={handleSubtaskAvatarClick}
              teamMembers={TEAM_MEMBERS}
              getMemberInitial={getMemberInitial}
              formatDate={formatDate}
              avatarColors={AVATAR_COLORS}
              onToggleSubtaskCompletion={handleToggleSubtaskCompletion}
            />
          )}
        </AntCard>
      </div>

      <CardDetailDrawer
        visible={detailDrawerVisible}
        card={{ ...card, subtasks: localSubtasks }}
        columnId={columnId}
        onCancel={() => setDetailDrawerVisible(false)}
        onUpdate={(columnId, updatedCard) => {
          if (updatedCard.subtasks) {
            setLocalSubtasks(updatedCard.subtasks);
          }
          onUpdate(columnId, updatedCard);
        }}
        onToggleComplete={() =>
          onUpdate(columnId, { ...card, completed: !card.completed })
        }
      />

      <MemberAssignmentModal
        visible={memberModalVisible}
        onCancel={() => setMemberModalVisible(false)}
        onSubmit={(members) => {
          onUpdate(columnId, { ...card, assignees: members });
          setMemberModalVisible(false);
        }}
        currentMembers={card.assignees || []}
      />
    </>
  );
};

export default Card;
