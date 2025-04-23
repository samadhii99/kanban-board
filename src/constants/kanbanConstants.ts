// src/constants/kanbanConstants.ts

export const AVATAR_COLORS = [
  "#f56a00",
  "#7265e6",
  "#1677ff",
  "#52c41a",
  "#722ed1",
  "#eb2f96",
];

export const TEAM_MEMBERS = [
  { email: "john@example.com", name: "John Doe" },
  { email: "jane@example.com", name: "Jane Smith" },
  { email: "michael@example.com", name: "Michael Brown" },
  { email: "emily@example.com", name: "Emily Johnson" },
  { email: "david@example.com", name: "David Wilson" },
];

// Predefined label color mapping
export const predefinedLabelColors: Record<
  string,
  { bg: string; text: string }
> = {
  "High Priority": { bg: "#f5222d", text: "#ffffff" },
  "Medium Priority": { bg: "#fa8c16", text: "#ffffff" },
  "Low Priority": { bg: "#52c41a", text: "#ffffff" },
  Bug: { bg: "#d4380d", text: "#ffffff" },
  Feature: { bg: "#1890ff", text: "#ffffff" },
  Enhancement: { bg: "#722ed1", text: "#ffffff" },
  Documentation: { bg: "#13c2c2", text: "#ffffff" },
  Frontend: { bg: "#eb2f96", text: "#ffffff" },
  Backend: { bg: "#2f54eb", text: "#ffffff" },
  "UI/UX": { bg: "#9254de", text: "#ffffff" },
  Testing: { bg: "#faad14", text: "#ffffff" },
  Development: { bg: "#52c41a", text: "#ffffff" },
  Maintenance: { bg: "#faad14", text: "#ffffff" },
  "UI/UX Bug": { bg: "#d4b106", text: "#ffffff" },
  "Awaiting review": { bg: "#ad6800", text: "#ffffff" },
};

// For language labels
export const getLanguageLabelColors = (
  lang: string
): { bg: string; text: string } => {
  // Create a consistent hash for each language
  const hashCode = lang.split("").reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);

  // Define pairs of background and text colors that look good together
  const colorPairs = [
    { bg: "#e6f7ff", text: "#1890ff" }, // Blue
    { bg: "#f6ffed", text: "#52c41a" }, // Green
    { bg: "#f9f0ff", text: "#722ed1" }, // Purple
    { bg: "#e6fffb", text: "#13c2c2" }, // Cyan
    { bg: "#fff0f6", text: "#eb2f96" }, // Pink
  ];

  return colorPairs[Math.abs(hashCode) % colorPairs.length];
};

// For custom labels (not predefined)
export const getCustomLabelColors = (
  label: string
): { bg: string; text: string } => {
  // Create a consistent hash for each custom label
  const hashCode = label.split("").reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);

  // Define pairs of background and text colors that look good together
  const colorPairs = [
    { bg: "#f5222d", text: "#ffffff" }, // Red
    { bg: "#fa541c", text: "#ffffff" }, // Volcano
    { bg: "#fa8c16", text: "#ffffff" }, // Orange
    { bg: "#faad14", text: "#ffffff" }, // Gold
    { bg: "#a0d911", text: "#ffffff" }, // Lime
    { bg: "#52c41a", text: "#ffffff" }, // Green
    { bg: "#13c2c2", text: "#ffffff" }, // Cyan
    { bg: "#1890ff", text: "#ffffff" }, // Blue
    { bg: "#2f54eb", text: "#ffffff" }, // Geekblue
    { bg: "#722ed1", text: "#ffffff" }, // Purple
    { bg: "#eb2f96", text: "#ffffff" }, // Magenta
  ];

  return colorPairs[Math.abs(hashCode) % colorPairs.length];
};

// Update these functions to use the new color system
export const getLabelBackground = (label: string): string => {
  // Check if it's a predefined label
  if (predefinedLabelColors[label]) {
    return predefinedLabelColors[label].bg;
  }

  // Check if it's a language label
  if (label.startsWith("Language:")) {
    return getLanguageLabelColors(label.split(": ")[1]).bg;
  }

  // It's a custom label
  return getCustomLabelColors(label).bg;
};

export const getLabelTextColor = (label: string): string => {
  // Check if it's a predefined label
  if (predefinedLabelColors[label]) {
    return predefinedLabelColors[label].text;
  }

  // Check if it's a language label
  if (label.startsWith("Language:")) {
    return getLanguageLabelColors(label.split(": ")[1]).text;
  }

  // It's a custom label
  return getCustomLabelColors(label).text;
};

export const getMemberInitial = (email: string): string => {
  const member = TEAM_MEMBERS.find((m) => m.email === email);
  if (member) {
    const nameParts = member.name.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return member.name[0].toUpperCase();
  }
  const namePart = email.split("@")[0];
  return namePart.charAt(0).toUpperCase();
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};
