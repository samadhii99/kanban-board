import React, { useState } from "react";
import {
  Modal,
  Typography,
  Descriptions,
  Button,
  Tag,
  Checkbox,
  DatePicker,
  Input,
  Select,
} from "antd";
import {
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { KanbanCard } from "../types/kanban";

const { Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CardDetailModalProps {
  visible: boolean;
  card: KanbanCard;
  columnId: string;
  onCancel: () => void;
  onUpdate: (columnId: string, updatedCard: KanbanCard) => void;
  onToggleComplete: () => void;
}

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

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  visible,
  card,
  columnId,
  onCancel,
  onUpdate,
  onToggleComplete,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    card.description || ""
  );
  const [editedLabels, setEditedLabels] = useState(card.labels || []);
  const [editedDueDate, setEditedDueDate] = useState<string | undefined>(
    card.dueDate
  );

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ru", label: "Russian" },
    { value: "ar", label: "Arabic" },
  ];

  const predefinedLabels = [
    "Bug",
    "Feature",
    "Enhancement",
    "Documentation",
    "High Priority",
    "Medium Priority",
    "Low Priority",
    "Frontend",
    "Backend",
    "UI/UX",
    "Testing",
  ];

  const handleSaveDescription = () => {
    onUpdate(columnId, {
      ...card,
      description: editedDescription,
    });
    setIsEditingDescription(false);
  };

  const handleSaveLabels = (newLabels: string[]) => {
    setEditedLabels(newLabels);
    onUpdate(columnId, {
      ...card,
      labels: newLabels,
    });
  };

  const handleSaveDueDate = (date: moment.Moment | null) => {
    const dueDate = date ? date.toISOString() : undefined;
    setEditedDueDate(dueDate);
    onUpdate(columnId, {
      ...card,
      dueDate,
    });
  };

  const formatDueDate = (dateString: string | undefined) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isPastDue = (dueDate: string | undefined): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Modal
      visible={visible}
      title={card.title}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Descriptions layout="vertical" bordered>
        <Descriptions.Item
          label={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Description</span>
              <Button
                type="text"
                icon={
                  isEditingDescription ? <SaveOutlined /> : <EditOutlined />
                }
                onClick={() =>
                  isEditingDescription
                    ? handleSaveDescription()
                    : setIsEditingDescription(true)
                }
                size="small"
              />
            </div>
          }
          span={3}
        >
          {isEditingDescription ? (
            <TextArea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              autoFocus
            />
          ) : (
            <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {card.description || "No description added yet."}
            </Paragraph>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Labels" span={3}>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select labels"
            value={editedLabels}
            onChange={handleSaveLabels}
            optionLabelProp="label"
          >
            {predefinedLabels.map((label) => (
              <Option key={label} value={label} label={label}>
                <Tag color={getLabelColor(label)}>{label}</Tag>
              </Option>
            ))}
            {languages.map((lang) => (
              <Option
                key={`lang-${lang.value}`}
                value={`Language: ${lang.label}`}
                label={`Language: ${lang.label}`}
              >
                <Tag color={getLabelColor(`Language: ${lang.label}`)}>
                  {`Language: ${lang.label}`}
                </Tag>
              </Option>
            ))}
          </Select>
          <div style={{ marginTop: 8 }}>
            {editedLabels.map((label, idx) => (
              <Tag
                key={idx}
                color={getLabelColor(label)}
                style={{ margin: "2px" }}
              >
                {label}
              </Tag>
            ))}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Due Date" span={2}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <DatePicker
              value={editedDueDate ? moment(editedDueDate) : null}
              onChange={handleSaveDueDate}
              allowClear
              format="YYYY-MM-DD"
            />
            {editedDueDate && (
              <Tag
                color={
                  isPastDue(editedDueDate) && !card.completed ? "red" : "blue"
                }
              >
                <CalendarOutlined /> {formatDueDate(editedDueDate)}
              </Tag>
            )}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Status" span={1}>
          <Checkbox checked={card.completed} onChange={onToggleComplete}>
            Mark as Complete
          </Checkbox>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CardDetailModal;
