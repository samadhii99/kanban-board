import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  DatePicker,
  Checkbox,
  Tag,
} from "antd";
import { KanbanCard } from "../types/kanban";
import moment, { Moment } from "moment";
import { PlusOutlined } from "@ant-design/icons";
import {
  getLabelBackground,
  getLabelTextColor,
} from "../constants/kanbanConstants";

const { TextArea } = Input;
const { Option } = Select;

interface CardFormProps {
  visible: boolean;
  initialValues?: Partial<KanbanCard>;
  onCancel: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    labels: string[];
    dueDate?: string;
    completed?: boolean;
    assignees?: string[];
  }) => void;
  loading?: boolean;
  availableMembers?: string[];
}

interface FormValues {
  title?: string;
  description?: string;
  labels?: string[];
  dueDate?: Moment;
  completed?: boolean;
  assignees?: string[];
}

// Predefined labels list
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

const CardForm: React.FC<CardFormProps> = ({
  visible,
  initialValues,
  onCancel,
  onSubmit,
  loading,
  availableMembers = [],
}) => {
  const [form] = Form.useForm<FormValues>();
  const [newLabelInput, setNewLabelInput] = useState("");
  const [customLabels, setCustomLabels] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      // Reset form first
      form.resetFields();

      if (initialValues) {
        // Omit dueDate from the spread
        const { dueDate, ...restValues } = initialValues;

        // Create form values without dueDate first
        const formValues: FormValues = { ...restValues };

        // Handle dueDate separately
        if (dueDate) {
          formValues.dueDate = moment(dueDate);
        }

        // Set form values
        form.setFieldsValue(formValues);

        // Extract custom labels from initial values
        if (initialValues.labels) {
          const languageLabels = languages.map(
            (lang) => `Language: ${lang.label}`
          );

          const customLabelsList = initialValues.labels.filter(
            (label) =>
              !predefinedLabels.includes(label) &&
              !languageLabels.includes(label)
          );

          setCustomLabels(customLabelsList);
        }
      }
    }
  }, [visible, initialValues, form]);

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

  const handleFinish = (values: FormValues) => {
    // Create submission object with same structure but string dueDate
    const submissionValues = {
      ...values,
      // Ensure we have required fields for submission
      title: values.title || "",
      description: values.description || "",
      labels: values.labels || [],
      assignees: values.assignees || [],
      // Convert Moment to string for dueDate
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    };

    // Submit the processed values
    onSubmit(submissionValues);
    form.resetFields();
  };

  // Add custom label handler
  const addCustomLabel = (value: string) => {
    if (value.trim() !== "") {
      // Get current labels
      const currentLabels = form.getFieldValue("labels") || [];

      // Only add if it doesn't already exist
      if (!currentLabels.includes(value)) {
        // Update form field
        form.setFieldsValue({
          labels: [...currentLabels, value],
        });

        // Add to custom labels list if not already there
        if (!customLabels.includes(value)) {
          setCustomLabels([...customLabels, value]);
        }
      }

      // Clear input field
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
    <Modal
      visible={visible}
      title={initialValues?.id ? "Edit Card" : "Add New Card"}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          title: "",
          description: "",
          labels: [],
          assignees: [],
          completed: false,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: false, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter card title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter card description" />
        </Form.Item>

        <Form.Item name="labels" label="Labels">
          <Select
            mode="multiple"
            placeholder="Search or select labels"
            showSearch
            filterOption={(input, option) => {
              if (!option) return false;
              const childrenValue = option.children as React.ReactNode;
              const childrenString = String(childrenValue);
              return childrenString.toLowerCase().includes(input.toLowerCase());
            }}
            dropdownRender={dropdownRender}
            optionLabelProp="label"
          >
            {predefinedLabels.map((label) => (
              <Option key={label} value={label} label={label}>
                <Tag
                  style={{
                    backgroundColor: getLabelBackground(label),
                    color: getLabelTextColor(label),
                    border: "none",
                  }}
                >
                  {label}
                </Tag>
              </Option>
            ))}

            {languages.map((lang) => {
              const labelText = `Language: ${lang.label}`;
              return (
                <Option
                  key={`lang-${lang.value}`}
                  value={labelText}
                  label={labelText}
                >
                  <Tag
                    style={{
                      backgroundColor: getLabelBackground(labelText),
                      color: getLabelTextColor(labelText),
                      border: "none",
                    }}
                  >
                    {labelText}
                  </Tag>
                </Option>
              );
            })}

            {/* Include custom labels */}
            {customLabels.map((label) => (
              <Option key={label} value={label} label={label}>
                <Tag
                  style={{
                    backgroundColor: getLabelBackground(label),
                    color: getLabelTextColor(label),
                    border: "none",
                  }}
                >
                  {label}
                </Tag>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="assignees" label="Assignees">
          <Select
            mode="multiple"
            placeholder="Select assignees"
            allowClear
            showSearch
            filterOption={(input, option) => {
              // Type-safe check for option and its children
              if (!option) return false;
              const childrenValue = option.children as React.ReactNode;

              // Convert to string if possible
              const childrenString = String(childrenValue);
              return childrenString.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {availableMembers.map((member) => (
              <Option key={member} value={member}>
                {member}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date">
          <DatePicker format="YYYY-MM-DD" placeholder="Select due date" />
        </Form.Item>

        <Form.Item name="completed" valuePropName="checked">
          <Checkbox>Mark as complete</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: 8 }}
          >
            {initialValues?.id ? "Update" : "Add"}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CardForm;
