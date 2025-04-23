# 🚀 React Kanban Board

A modern, responsive, and feature-rich Kanban board built with React, TypeScript, and Ant Design.




## ✨ Features

- **📱 Fully Responsive**: Works seamlessly on desktops, tablets, and mobile devices
- **🌓 Dark/Light Mode**: Toggle between themes for comfortable viewing in any lighting
- **🎯 Rich Card Management**: Create, edit, and delete cards with detailed information
- **🏷️ Labels & Priorities**: Organize tasks with custom labels and priority levels
- **👥 Assignees**: Assign tasks to team members and filter by assignee
- **📅 Due Dates**: Set and track deadlines for your tasks
- **✅ Subtasks**: Break down complex tasks into manageable subtasks
- **🔍 Powerful Filtering**: Filter and sort cards by various criteria
- **🖱️ Drag and Drop**: Intuitive drag-and-drop interface using dnd-kit
- **📊 Board Customization**: Add, rename, and remove columns as needed

  ![Kanban Board Screenshot](https://github.com/samadhii99/kanban-board/blob/342cd7d09db2131282913f603fa6297f1e3188fb/ex.PNG)

  ![Kanban Board Screenshot](https://github.com/samadhii99/kanban-board/blob/03529f05c93ccdecdfd52996cc6d0198bc89edff/ex-2.PNG)

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Redux** for state management
- **Ant Design** for UI components
- **@dnd-kit** for drag-and-drop functionality
- **CSS-in-JS** for styling components

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/samadhii99/kanban-board.git
cd kanban-board
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## 📖 Usage

### Board Navigation

- **Horizontal Scrolling**: Navigate between columns by scrolling horizontally
- **Vertical Scrolling**: View all cards in a column by scrolling vertically within each column

### Card Management

1. **Create a Card**: Click the "Add Task" button at the bottom of any column
2. **Edit a Card**: Click on a card to view details, then click the edit icon
3. **Move a Card**: Drag and drop cards between columns or within the same column
4. **Delete a Card**: Open card details and click the delete icon

### Filtering and Sorting

Use the filter bar above the board to:
- Sort cards by title, priority, due date, or creation date
- Filter cards by priority level, labels, or assignees

## 🎨 Customization

### Theme Customization

The application supports both light and dark themes. Toggle between them using the theme button in the header.

### Column Customization

- **Add Column**: Click the "Add Column" button in the board header
- **Edit Column**: Click the menu icon on a column and select "Edit"
- **Delete Column**: Click the menu icon on a column and select "Delete"

## 🔍 Project Structure

```
└── src/
    ├── assets/
    ├── components/
    │   ├── AddColumnModal.tsx
    │   ├── Board.tsx
    │   ├── Card.tsx
    │   ├── CardDetailDrawer.tsx
    │   ├── CardForm.tsx
    │   ├── Column.tsx
    │   ├── DarkModeToggle.css
    │   ├── DarkModeToggle.tsx
    │   ├── ErrorBoundary.tsx
    │   ├── FilterBar.tsx
    │   ├── kanban-respond
    │   ├── KanbanBoard.tsx
    │   ├── KanbanCard.tsx
    │   ├── MemberAssignmentModal.tsx
    │   ├── SubtaskSection.tsx
    │   ├── ThemeProvider.tsx
    │   └── ThemeToggleButton.tsx
    ├── constants/
    │   └── kanbanConstants.ts
    ├── store/
    │   ├── index.ts
    │   └── kanbanSlice.ts
    ├── types/
    │   └── kanban.ts
    ├── App.css
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── vite-env.d.ts
├── eslint.config.js
├── index.html
```

## 📝 Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time collaboration
- [ ] Cloud synchronization
- [ ] Templates and board presets
- [ ] Advanced analytics and reporting
- [ ] Mobile app versions
- [ ] Keyboard shortcuts and accessibility improvements

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Ant Design](https://ant.design/) for the beautiful UI components
- [dnd kit](https://dndkit.com/) for the drag and drop functionality
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

---

<p align="center">Made with ❤️ by Samadhi</p>
