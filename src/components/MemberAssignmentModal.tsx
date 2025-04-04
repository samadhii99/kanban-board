import React, { useState, useEffect } from "react";
import { Modal, Input, Button, List, Avatar, Divider, Form, Tabs } from "antd";
import { UserOutlined, MailOutlined, SearchOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

interface MemberAssignmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (members: string[]) => void;
  currentMembers: string[];
}

// Mock team members for demonstration
const TEAM_MEMBERS = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Smith", email: "jane@example.com" },
  { name: "Michael Brown", email: "michael@example.com" },
  { name: "Emily Johnson", email: "emily@example.com" },
  { name: "David Wilson", email: "david@example.com" },
];

const MemberAssignmentModal: React.FC<MemberAssignmentModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  currentMembers = [],
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [activeTab, setActiveTab] = useState("1");

  // Initialize selected members when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedMembers([...currentMembers]);
    }
  }, [visible, currentMembers]);

  // Filter members based on search text
  const filteredMembers = TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle member selection/deselection
  const toggleMember = (email: string) => {
    setSelectedMembers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(selectedMembers);
  };

  // Handle inviting a new member
  const handleInviteMember = () => {
    if (newMemberEmail && newMemberEmail.includes("@")) {
      setSelectedMembers((prev) =>
        prev.includes(newMemberEmail) ? prev : [...prev, newMemberEmail]
      );
      setNewMemberEmail("");
      // In a real app, you'd send an invitation email here
    }
  };

  return (
    <Modal
      title="Assign Members"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          OK
        </Button>,
      ]}
      width={500}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Search Team Members" key="1">
          <Input
            placeholder="Search by name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <List
            itemLayout="horizontal"
            dataSource={filteredMembers}
            renderItem={(member) => (
              <List.Item
                onClick={() => toggleMember(member.email)}
                style={{ cursor: "pointer" }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={member.name}
                  description={member.email}
                />
                <div>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.email)}
                    onChange={() => {}}
                  />
                </div>
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane tab="Invite New Member" key="2">
          <Form layout="vertical">
            <Form.Item
              label="Email Address"
              required
              rules={[{ type: "email" }]}
            >
              <Input
                placeholder="Enter email address"
                prefix={<MailOutlined />}
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleInviteMember}
              disabled={!newMemberEmail || !newMemberEmail.includes("@")}
            >
              Invite
            </Button>
          </Form>
        </TabPane>
      </Tabs>

      {selectedMembers.length > 0 && (
        <>
          <Divider>Selected ({selectedMembers.length})</Divider>
          <List
            size="small"
            dataSource={selectedMembers}
            renderItem={(email) => {
              const member = TEAM_MEMBERS.find((m) => m.email === email);
              return (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      onClick={() => toggleMember(email)}
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={member ? member.name : email}
                    description={member ? null : email}
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default MemberAssignmentModal;
