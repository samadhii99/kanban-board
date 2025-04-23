import React, { useState } from "react";
import {
  Drawer,
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
  PlusOutlined,
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

// Improved label color mapping with custom label support
const getLabelColor = (label: string): string => {
  // Use string hash to generate consistent colors for custom labels
  if (!predefinedLabelColors[label]) {
    const hashCode = label.split("").reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);

    const colors = [
      "red",
      "volcano",
      "orange",
      "gold",
      "yellow",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
      "magenta",
      "pink",
    ];

    return colors[Math.abs(hashCode) % colors.length];
  }

  return predefinedLabelColors[label];
};

// Predefined label colors
const predefinedLabelColors: Record<string, string> = {
  "High Priority": "red",
  "Medium Priority": "orange",
  "Low Priority": "green",
  Bug: "volcano",
  Feature: "geekblue",
  Enhancement: "purple",
  Documentation: "cyan",
  Frontend: "magenta",
  Backend: "blue",
  "UI/UX": "pink",
  Testing: "gold",
};

// For language labels
const getLanguageLabelColor = (lang: string): string => {
  // Use string hash to generate consistent colors for language labels
  const hashCode = lang.split("").reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);

  const colors = ["lime", "green", "cyan", "blue", "purple"];
  return colors[Math.abs(hashCode) % colors.length];
};

// Renamed to CardDetailDrawer to reflect its new nature
const CardDetailDrawer: React.FC<CardDetailModalProps> = ({
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
  const [newLabelInput, setNewLabelInput] = useState("");

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

  // Add custom label handler
  const addCustomLabel = (value: string) => {
    if (value.trim() !== "" && !editedLabels.includes(value)) {
      const newLabels = [...editedLabels, value];
      handleSaveLabels(newLabels);
      setNewLabelInput("");
    }
  };

  // Dropdown render with search and create functionality
  const dropdownRender = (menu: React.ReactElement) => (
    <div>
      {menu}
      <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
        <Input
          value={newLabelInput}
          onChange={(e) => setNewLabelInput(e.target.value)}
          placeholder="Type to create label"
          style={{ flex: "auto" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addCustomLabel(newLabelInput)}
          style={{ marginLeft: 8 }}
        >
          Add
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      visible={visible}
      title={card.title}
      onClose={onCancel}
      width={500}
      placement="right"
      extra={[
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
            placeholder="Search or select labels"
            value={editedLabels}
            onChange={handleSaveLabels}
            optionLabelProp="label"
            showSearch
            allowClear
            dropdownRender={dropdownRender}
            filterOption={(input, option) =>
              option?.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
              0
            }
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
                <Tag color={getLanguageLabelColor(lang.label)}>
                  {`Language: ${lang.label}`}
                </Tag>
              </Option>
            ))}
            {/* Include existing custom labels that aren't in the predefined lists */}
            {editedLabels
              .filter(
                (label) =>
                  !predefinedLabels.includes(label) &&
                  !languages.some((lang) => `Language: ${lang.label}` === label)
              )
              .map((customLabel) => (
                <Option
                  key={customLabel}
                  value={customLabel}
                  label={customLabel}
                >
                  <Tag color={getLabelColor(customLabel)}>{customLabel}</Tag>
                </Option>
              ))}
          </Select>
          <div style={{ marginTop: 8 }}>
            {editedLabels.map((label, idx) => (
              <Tag
                key={idx}
                color={
                  label.startsWith("Language:")
                    ? getLanguageLabelColor(label.split(": ")[1])
                    : getLabelColor(label)
                }
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
    </Drawer>
  );
};

export default CardDetailDrawer;
