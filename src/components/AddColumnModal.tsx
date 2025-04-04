import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface AddColumnModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (title: string) => void;
}

const AddColumnModal: React.FC<AddColumnModalProps> = ({
  visible,
  onCancel,
  onAdd,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { title: string }) => {
    onAdd(values.title);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title="Add New Column"
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ title: "" }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a column title" }]}
        >
          <Input placeholder="Enter column title" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Add
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddColumnModal;
