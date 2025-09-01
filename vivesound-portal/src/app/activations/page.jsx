"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, Statistic, Space, Button, Progress, Grid, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import SidebarLayout from "../components/Navbar";
import ActivationsTable from "../components/ActivationsTable";
import dayjs from "dayjs";

const { useBreakpoint } = Grid;

export default function ActivationsPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const [data, setData] = useState([]);
  const [totalActivations, setTotalActivations] = useState(null);
  const [allowedActivations, setAllowedActivations] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const pct = Math.min(
    100,
    Math.round((totalActivations / Math.max(allowedActivations || 1, 1)) * 100)
  );

  // Fetch users from /api/get-users
  const fetchUsers = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch("/api/get-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // server reads cookies; body not needed
        cache: "no-store",
        credentials: "include",
      });
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (_) {
        // leave json as null; we'll surface raw text in the error below
      }
      if (!res.ok) {
        throw new Error(
          (json && json.message) ||
            `Failed with ${res.status}: ${text?.slice(0, 180)}`
        );
      }

      // Accept either an array or {users:[...]}
      const raw = Array.isArray(json)
        ? json
        : json?.licenseDetails[0]?.activations || [];

      // Normalize into the shape your table expects
      const normalized = (raw || []).map((u, idx) => ({
        id: u.licenseId,
        os: u.os,
        osVersion: u.osVersion,
        hostname: u.hostname,
        ip: u.location.ipAddress,
        region: u.location.regionName,
        country: u.location.countryName,
        updatedAt: dayjs(u.updatedAt).format("MM-DD-YYYY"),
      }));
      const totalActive = json?.licenseDetails[0]?.totalActivations;
      const allowedActive = json?.licenseDetails[0]?.allowedActivations;

      setData(normalized);
      setTotalActivations(totalActive);
      setAllowedActivations(allowedActive);
    } catch (e) {
      console.error("fetchUsers error:", e);
      message.error(e.message || "Could not load users.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
              {totalActivations} / {allowedActivations}
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
        </div>
      </Card>

      {/* Table of activations */}
      <ActivationsTable data={data} loadingData={loadingData} />
    </SidebarLayout>
  );
}
