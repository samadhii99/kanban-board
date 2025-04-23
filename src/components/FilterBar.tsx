import React, { useState } from "react";
import {
  Row,
  Col,
  Select,
  Input,
  Divider,
  Button,
  Tooltip,
  Badge,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  SortAscendingOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Option } = Select;

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onPriorityFilter: (priorities: string[]) => void;
  onLabelFilter: (labels: string[]) => void;
  onMemberFilter: (members: string[]) => void;
  onGroupByChange: (value: string) => void;
  availableLabels: string[];
  availableMembers: string[];
}

// Priority color map
const priorityColors = {
  "Low Priority": "#52c41a", // green
  "Medium Priority": "#faad14", // yellow
  "High Priority": "#f5222d", // red
};

// Generate random colors for labels (in a real app, these would be consistent)
const generateLabelColor = (label: string) => {
  const colors = [
    "#1890ff",
    "#722ed1",
    "#eb2f96",
    "#fa8c16",
    "#a0d911",
    "#13c2c2",
  ];
  const hash = label
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const FilterBar: React.FC<FilterBarProps> = ({
  onSortChange,
  onPriorityFilter,
  onLabelFilter,
  onMemberFilter,
  onGroupByChange,
  availableLabels,
  availableMembers,
}) => {
  const [searchMember, setSearchMember] = useState("");
  const [searchLabel, setSearchLabel] = useState("");
  const [selectedSort, setSelectedSort] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const priorityOptions = ["Low Priority", "Medium Priority", "High Priority"];

  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "status", label: "Status" },
    { value: "priority", label: "Priority" },
    { value: "startDate", label: "Start Date" },
    { value: "dueDate", label: "Due Date" },
    { value: "completedDate", label: "Completed Date" },
    { value: "createdDate", label: "Created Date" },
    { value: "updatedDate", label: "Last Updated" },
  ];

  const groupByOptions = [
    { value: "status", label: "Status" },
    { value: "priority", label: "Priority" },
    { value: "phase", label: "Phase" },
    { value: "member", label: "Members" },
  ];

  const filteredMembers = availableMembers.filter((member) =>
    member.toLowerCase().includes(searchMember.toLowerCase())
  );

  const filteredLabels = availableLabels.filter((label) =>
    label.toLowerCase().includes(searchLabel.toLowerCase())
  );

  const labelStyle = {
    marginRight: "8px",
    marginLeft: "8px",
    color: "inherit",
  };

  // Handle changes with local state tracking
  const handleSortChange = (values: string[]) => {
    setSelectedSort(values);
    onSortChange(values.length > 0 ? values[0] : "");
  };

  const handlePriorityChange = (values: string[]) => {
    setSelectedPriorities(values);
    onPriorityFilter(values);
  };

  const handleLabelChange = (values: string[]) => {
    setSelectedLabels(values);
    onLabelFilter(values);
  };

  const handleMemberChange = (values: string[]) => {
    setSelectedMembers(values);
    onMemberFilter(values);
  };

  // Custom render for option items with checkbox and color dot
  const renderPriorityOption = (priority: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox checked={selectedPriorities.includes(priority)} />
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor:
            priorityColors[priority as keyof typeof priorityColors] || "#ccc",
          marginLeft: "8px",
          marginRight: "8px",
        }}
      />
      <span>{priority}</span>
    </div>
  );

  const renderLabelOption = (label: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox checked={selectedLabels.includes(label)} />
      <span
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: generateLabelColor(label),
          marginLeft: "8px",
          marginRight: "8px",
        }}
      />
      <span>{label}</span>
    </div>
  );

  const renderSortOption = (option: { value: string; label: string }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Checkbox checked={selectedSort.includes(option.value)} />
      <span style={{ marginLeft: "8px" }}>{option.label}</span>
    </div>
  );

  return (
    <div className="filter-bar" style={{ padding: "20px" }}>
      <Row gutter={8} align="middle">
        <Col>
          <Button
            icon={<SearchOutlined />}
            size="small"
            style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
          />
        </Col>

        <Col>
          <Select
            placeholder="Sort"
            style={{ width: "110px" }}
            mode="multiple"
            value={selectedSort}
            onChange={handleSortChange}
            allowClear
            size="small"
            bordered
            suffixIcon={<SortAscendingOutlined />}
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            maxTagPlaceholder={() => (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Sort
                {selectedSort.length > 0 && (
                  <Badge
                    count={selectedSort.length}
                    size="small"
                    style={{
                      backgroundColor: "#1890ff",
                      marginLeft: "4px",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>
            )}
            // This is the key change to prevent automatic selection indicators
            menuItemSelectedIcon={null}
          >
            {sortOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {renderSortOption(option)}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Select
            placeholder="Priority"
            mode="multiple"
            style={{ width: "120px" }}
            onChange={handlePriorityChange}
            value={selectedPriorities}
            allowClear
            size="small"
            bordered
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            // Remove the default selection indicator
            menuItemSelectedIcon={null}
            maxTagPlaceholder={() => (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Priority
                {selectedPriorities.length > 0 && (
                  <Badge
                    count={selectedPriorities.length}
                    size="small"
                    style={{
                      backgroundColor: "#1890ff",
                      marginLeft: "4px",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>
            )}
          >
            {priorityOptions.map((priority) => (
              <Option key={priority} value={priority}>
                {renderPriorityOption(priority)}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Select
            placeholder="Labels"
            mode="multiple"
            style={{ width: "120px" }}
            onChange={handleLabelChange}
            value={selectedLabels}
            allowClear
            size="small"
            bordered
            showSearch
            onSearch={setSearchLabel}
            filterOption={false}
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            // Remove the default selection indicator
            menuItemSelectedIcon={null}
            maxTagPlaceholder={() => (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Labels
                {selectedLabels.length > 0 && (
                  <Badge
                    count={selectedLabels.length}
                    size="small"
                    style={{
                      backgroundColor: "#1890ff",
                      marginLeft: "4px",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>
            )}
            dropdownRender={(menu) => (
              <>
                <Input
                  placeholder="Search by name"
                  value={searchLabel}
                  onChange={(e) => setSearchLabel(e.target.value)}
                  style={{ padding: "8px" }}
                  size="small"
                  prefix={<SearchOutlined />}
                />
                <Divider style={{ margin: "4px 0" }} />
                {menu}
              </>
            )}
          >
            {filteredLabels.map((label) => (
              <Option key={label} value={label}>
                {renderLabelOption(label)}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Select
            placeholder="Members"
            mode="multiple"
            style={{ width: "140px" }}
            onChange={handleMemberChange}
            value={selectedMembers}
            allowClear
            showSearch
            size="small"
            bordered
            onSearch={setSearchMember}
            filterOption={false}
            dropdownMatchSelectWidth={false}
            maxTagCount={0}
            // Remove the default selection indicator
            menuItemSelectedIcon={null}
            maxTagPlaceholder={() => (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Members
                {selectedMembers.length > 0 && (
                  <Badge
                    count={selectedMembers.length}
                    size="small"
                    style={{
                      backgroundColor: "#1890ff",
                      marginLeft: "4px",
                      flexShrink: 0,
                    }}
                  />
                )}
              </span>
            )}
            dropdownRender={(menu) => (
              <>
                <Input
                  placeholder="Search by name"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  style={{ padding: "8px" }}
                  size="small"
                  prefix={<SearchOutlined />}
                />
                <Divider style={{ margin: "4px 0" }} />
                {menu}
              </>
            )}
          >
            {filteredMembers.map((member) => (
              <Option key={member} value={member}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox checked={selectedMembers.includes(member)} />
                  <span style={{ marginLeft: "8px" }}>{member}</span>
                </div>
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <span style={labelStyle}>Group by:</span>
        </Col>

        <Col>
          <Select
            defaultValue="status"
            style={{ width: "100px" }}
            onChange={onGroupByChange}
            size="small"
            bordered
            dropdownMatchSelectWidth={false}
          >
            {groupByOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col>
          <Tooltip title="Settings">
            <Button
              icon={<SettingOutlined />}
              type="text"
              size="small"
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};

export default FilterBar;
