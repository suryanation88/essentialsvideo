import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import HeaderSearch from "./HeaderSearch";

const { Header, Sider, Content, Footer } = Layout;

const siderWidth = 200;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={siderWidth}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: "#fff",
          zIndex: 100,
        }}
      >
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
          <img src="/Essential Video.png" alt="Essential Video Logo" style={{ maxHeight: "100%", maxWidth: "80%", objectFit: "contain" }} />
        </div>
        <SidebarMenu />
      </Sider>
      <Layout style={{ marginLeft: siderWidth }}>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 64,
          }}
        >
          <HeaderSearch />
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: "8px",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Essential Video ©{new Date().getFullYear()} Created by Bodrex Team</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
