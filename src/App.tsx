import React, { useEffect } from "react";
import { Layout } from "antd";
import { Provider } from "react-redux";
import { store } from "./store";
import Board from "./components/Board";
import "antd/dist/reset.css";
import "./App.css";
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
    <Provider store={store}>
      <Layout style={{ width: "100vw", height: "100vh" }}>
        <Header
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "20px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Project Management
        </Header>
        <Content
          style={{
            padding: "20px",
            height: "calc(100vh - 64px)",
            overflow: "hidden",
          }}
        >
          <ErrorBoundary>
            <Board />
          </ErrorBoundary>
        </Content>
      </Layout>
    </Provider>
  );
};

export default App;
