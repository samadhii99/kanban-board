import React, { useEffect } from "react";
import { Form, Input, Button, Select, Modal, DatePicker, Checkbox } from "antd";
import { KanbanCard } from "../types/kanban";
import moment, { Moment } from "moment";

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
  }) => void;
  loading?: boolean;
}

interface FormValues {
  title?: string;
  description?: string;
  labels?: string[];
  dueDate?: Moment;
  completed?: boolean;
}

const CardForm: React.FC<CardFormProps> = ({
  visible,
  initialValues,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm<FormValues>();

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
      // Convert Moment to string for dueDate
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
    };

    // Submit the processed values
    onSubmit(submissionValues);
    form.resetFields();
  };

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
          completed: false,
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter card title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter card description" />
        </Form.Item>

        <Form.Item name="labels" label="Labels">
          <Select mode="multiple" placeholder="Select labels">
            <Option value="Bug">Bug</Option>
            <Option value="Feature">Feature</Option>
            <Option value="Enhancement">Enhancement</Option>
            <Option value="Documentation">Documentation</Option>
            <Option value="High Priority">High Priority</Option>
            <Option value="Medium Priority">Medium Priority</Option>
            <Option value="Low Priority">Low Priority</Option>
            <Option value="Frontend">Frontend</Option>
            <Option value="Backend">Backend</Option>
            {languages.map((lang) => (
              <Option key={lang.value} value={`Language: ${lang.label}`}>
                Language: {lang.label}
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
