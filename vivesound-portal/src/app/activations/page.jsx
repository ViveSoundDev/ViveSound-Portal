"use client";

import React, { useEffect, useState } from "react";
import { Card, Statistic, Space, Button, Progress, Grid, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import SidebarLayout from "../components/Navbar";
import ActivationsTable from "../components/ActivationsTable";

const { useBreakpoint } = Grid;

export default function ActivationsPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // Demo state — replace with your API data
  const [totalAllowed, setTotalAllowed] = useState(5);
  const [currentActive, setCurrentActive] = useState(2);
  const [loading, setLoading] = useState(false);

  const pct = Math.min(
    100,
    Math.round((currentActive / Math.max(totalAllowed || 1, 1)) * 100)
  );

  // Example: load summary from your backend
  const loadSummary = async () => {
    setLoading(true);
    try {
      // const res = await fetch("/api/activations/summary", { credentials: "include" });
      // const json = await res.json();
      // setTotalAllowed(json.totalAllowed);
      // setCurrentActive(json.currentActive);
      message.success("Summary refreshed");
    } catch (e) {
      console.error(e);
      message.error("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <SidebarLayout>
      {/* Top summary card */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 14,
          background: "linear-gradient(135deg, #1677ff 0%, #69c0ff 100%)",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{
          padding: isMobile ? 16 : 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Space direction="vertical" size={6}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
              Sessions in Use
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: isMobile ? 28 : 36,
                lineHeight: 1,
              }}
            >
              {currentActive} / {totalAllowed}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Progress
                  percent={pct}
                  showInfo={false}
                  strokeColor="#ffffff"
                  trailColor="rgba(255,255,255,0.25)"
                  strokeWidth={10}
                />
              </div>
              <div style={{ fontWeight: 600, color: "#fff" }}>{pct}%</div>
            </div>
          </Space>

          <Button
            icon={<ReloadOutlined />}
            onClick={loadSummary}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </Card>

      {/* Table of activations */}
      <ActivationsTable />
    </SidebarLayout>
  );
}
