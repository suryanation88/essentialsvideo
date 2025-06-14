import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ea4d1e",
        },
        components: {
          Pagination: {
            itemActiveBg: "#ea4d1e",
            itemActiveColor: "#fff",
            itemActiveBorderColor: "#ea4d1e",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
