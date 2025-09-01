"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, Button, Grid } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined
} from "@ant-design/icons";

const { Sider, Content, Header } = Layout;
const { useBreakpoint } = Grid;

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const screens = useBreakpoint();
  const isMobile = !screens.lg; // < lg

  // collapsed state
  const [collapsed, setCollapsed] = useState(true); // start collapsed on mobile

  // Keep selection in sync with route
  const selectedKeys = useMemo(() => {
    if (pathname === "/users" || pathname?.startsWith("/users"))
      return ["/users"];
    if (pathname?.startsWith("/my-account")) return ["/my-account"];
    if (pathname?.startsWith("/activations")) return ["/activations"];
    return [];
  }, [pathname]);

  const items = [
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: <Link href="/users">Users</Link>,
    },
    {
      key: "/activations",
      icon: <DashboardOutlined />,
      label: <Link href="/activations">Activations</Link>,
    },
    {
      key: "/my-account",
      icon: <UserOutlined />,
      label: <Link href="/my-account">My Account</Link>,
    },
    { type: "divider" },
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const onMenuClick = async ({ key }) => {
    if (key === "logout") {
      await fetch("/api/logout", { method: "POST" });
      router.push("/");

      return;
    }
    if (isMobile) setCollapsed(true); // auto-close sidebar after navigation on mobile
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        // When under "lg", collapse to 0 (hidden). On desktop, collapse width is 80px.
        collapsedWidth={isMobile ? 0 : 80}
        width={240}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          // broken === true when < lg
          setCollapsed(broken); // auto collapse on mobile, expand on desktop
        }}
        style={{ background: "#fff" }}
      >
        <div
          onClick={() => {
            router.push("/");
            if (isMobile) setCollapsed(true);
          }}
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            padding: collapsed ? "0 12px" : "0 16px",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 600,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          {collapsed && isMobile ? "" : collapsed ? "VS" : "ViveSound"}
        </div>

        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={items}
          onClick={onMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Content style={{ padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
