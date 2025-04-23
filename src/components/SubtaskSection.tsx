// src/components/SubtaskSection.tsx
import React, { useState } from "react";
import { Button, Input, DatePicker, Popover, Avatar } from "antd";
import {
  ForkOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { SubTask } from "../types/kanban";
import { useTheme } from "../components/ThemeProvider";

interface SubtaskSectionProps {
  subtasks: SubTask[];
  onAddSubtask: (subtask: SubTask) => void;
  onSubtaskClick: (e: React.MouseEvent) => void;
  onAvatarClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  teamMembers: { email: string; name: string }[];
  getMemberInitial: (email: string) => string;
  formatDate: (dateString: string | undefined) => string | null;
  avatarColors: string[];
  onToggleSubtaskCompletion: (subtaskId: string) => void;
}

const SubtaskSection: React.FC<SubtaskSectionProps> = ({
  subtasks,
  onAddSubtask,
  onSubtaskClick,
  onAvatarClick,
  teamMembers,
  getMemberInitial,
  formatDate,
  avatarColors,
  onToggleSubtaskCompletion,
}) => {
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState<any>(null);
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState<string | null>(
    null
  );
  const [showMemberPopover, setShowMemberPopover] = useState(false);

  const { theme } = useTheme();

  // Debug logs
  console.log("SubtaskSection rendering with subtasks:", subtasks);

  const handleSaveSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtaskTitle,
      completed: false,
      assignee: newSubtaskAssignee || undefined,
      dueDate: newSubtaskDueDate ? newSubtaskDueDate.toISOString() : undefined,
    };

    console.log("Creating new subtask:", newSubtask);

    onAddSubtask(newSubtask);

    // Reset form
    setNewSubtaskTitle("");
    setNewSubtaskDueDate(null);
    setNewSubtaskAssignee(null);
    setIsAddingSubtask(false);
  };

  const handleCancelSubtask = () => {
    setNewSubtaskTitle("");
    setNewSubtaskDueDate(null);
    setNewSubtaskAssignee(null);
    setIsAddingSubtask(false);
  };

  const handleMemberSelect = (email: string) => {
    setNewSubtaskAssignee(email);
    setShowMemberPopover(false);
  };

  const handleAvatarClick = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e) {
      e.stopPropagation();
      if (onAvatarClick) {
        onAvatarClick(e);
      }
    }
  };

  const memberPopoverContent = (
    <div style={{ width: 200 }}>
      {teamMembers.map((member) => (
        <div
          key={member.email}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "4px",
            backgroundColor:
              newSubtaskAssignee === member.email ? "#f0f0f0" : "transparent",
          }}
          onClick={() => handleMemberSelect(member.email)}
        >
          <Avatar
            size="small"
            style={{
              backgroundColor:
                avatarColors[teamMembers.indexOf(member) % avatarColors.length],
            }}
          >
            {getMemberInitial(member.email)}
          </Avatar>
          <div style={{ fontSize: "13px" }}>{member.name}</div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Subtasks Section Header */}
      <div
        style={{
          borderTop: `1px solid ${theme === "dark" ? "#424242" : "#f0f0f0"}`,
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#fafafa",
        }}
      >
        <div
          style={{
            fontWeight: 500,
            fontSize: "12px",
            color:
              theme === "dark"
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
          Subtasks {subtasks.length > 0 && `(${subtasks.length})`}
        </div>
      </div>

      {/* Subtasks List */}
      <div
        style={{
          padding: "0",
          backgroundColor: theme === "dark" ? "#262626" : "#fff",
        }}
      >
        {subtasks.length > 0 ? (
          subtasks.map((subtask, idx) => (
            <div
              key={subtask.id}
              style={{
                padding: "10px 16px",
                borderTop: `1px solid ${
                  theme === "dark" ? "#424242" : "#f0f0f0"
                }`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSubtaskCompletion(subtask.id);
                onSubtaskClick(e);
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  textDecoration: subtask.completed ? "line-through" : "none",
                  color: subtask.completed
                    ? theme === "dark"
                      ? "rgba(255, 255, 255, 0.45)"
                      : "rgba(0, 0, 0, 0.45)"
                    : theme === "dark"
                    ? "rgba(255, 255, 255, 0.85)"
                    : "inherit",
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
                      color:
                        theme === "dark"
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
                      backgroundColor: avatarColors[idx % avatarColors.length],
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
              color: theme === "dark" ? "rgba(255, 255, 255, 0.45)" : "#8c8c8c",
              fontSize: "13px",
            }}
          >
            No subtasks yet
          </div>
        )}

        {/* Add Subtask Input */}
        {isAddingSubtask ? (
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${
                theme === "dark" ? "#424242" : "#f0f0f0"
              }`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              placeholder="Enter subtask title"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              style={{ marginBottom: "8px" }}
              onPressEnter={handleSaveSubtask}
              autoFocus
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <DatePicker
                  placeholder="Due date"
                  value={newSubtaskDueDate}
                  onChange={(date) => setNewSubtaskDueDate(date)}
                  size="small"
                  style={{ width: 120 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <Popover
                  content={memberPopoverContent}
                  trigger="click"
                  open={showMemberPopover}
                  onOpenChange={(visible) => {
                    setShowMemberPopover(visible);
                  }}
                  placement="bottomLeft"
                >
                  <Button
                    icon={<UserAddOutlined />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: newSubtaskAssignee ? "0 8px" : "0 4px",
                      width: newSubtaskAssignee ? "auto" : "32px",
                    }}
                  >
                    {newSubtaskAssignee && (
                      <Avatar
                        size="small"
                        style={{
                          backgroundColor:
                            avatarColors[
                              teamMembers.findIndex(
                                (m) => m.email === newSubtaskAssignee
                              ) % avatarColors.length
                            ],
                          width: "20px",
                          height: "20px",
                          fontSize: "10px",
                          marginLeft: "4px",
                        }}
                      >
                        {getMemberInitial(newSubtaskAssignee)}
                      </Avatar>
                    )}
                  </Button>
                </Popover>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveSubtask();
                  }}
                  style={{ color: "#52c41a" }}
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelSubtask();
                  }}
                  style={{ color: "#ff4d4f" }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${
                theme === "dark" ? "#424242" : "#f0f0f0"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: theme === "dark" ? "#1677ff" : "#1677ff",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingSubtask(true);
            }}
          >
            <PlusOutlined style={{ fontSize: "12px", marginRight: "4px" }} />
            <span style={{ fontSize: "13px" }}>Add Subtask</span>
          </div>
        )}
      </div>
    </>
  );
};

export default SubtaskSection;
