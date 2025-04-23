import React, { useEffect } from "react";
import { Layout } from "antd";
import Board from "./components/Board";
import "antd/dist/reset.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggleButton from "./components/ThemeToggleButton";
import "./App.css";
import "./components/DarkModeToggle.css";
import ErrorBoundary from "./components/ErrorBoundary";

const { Header, Content } = Layout;

// Declare the custom property on the window object
declare global {
  interface Window {
    __react_beautiful_dnd_disable_dev_warnings: boolean;
  }
}

// Fix for react-beautiful-dnd in React 18
const useMount = (fn: () => void) => useEffect(fn, []);

const App: React.FC = () => {
  // Apply the fix before rendering
  useMount(() => {
    window.__react_beautiful_dnd_disable_dev_warnings = true;
  });

  return (
    <ThemeProvider>
      <div className="app">
        <Layout
          className="app-layout"
          style={{ width: "100vw", height: "100vh" }}
        >
          <Header
            className="app-header"
            style={{
              textAlign: "center",
              fontSize: "20px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              color: "white",
            }}
          >
            <div></div> <div>Project Management</div>
            <ThemeToggleButton />
          </Header>
          <Content
            className="app-content"
            style={{
              padding: "20px",
              height: "calc(100vh - 64px)",
              overflow: "hidden", // Keep this to prevent vertical scrolling of the content area itself
            }}
          >
            
              <ErrorBoundary>
                <Board />
              </ErrorBoundary>
            
          </Content>
        </Layout>
      </div>
    </ThemeProvider>
  );
};

export default App;