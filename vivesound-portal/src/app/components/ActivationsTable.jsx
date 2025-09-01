"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  DatePicker,
  Grid,
} from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { useBreakpoint } = Grid;
const { RangePicker } = DatePicker;

export default function ActivationsTable() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  // --- Demo data (replace with fetch to your backend) ---
  const [data, setData] = useState([
    {
      id: "a_1",
      os: "Windows",
      osVersion: "11 Pro 23H2",
      hostname: "WS-LAPTOP-001",
      ip: "34.201.16.55",
      region: "Virginia",
      country: "US",
      updatedAt: "2025-08-30",
    },
    {
      id: "a_2",
      os: "macOS",
      osVersion: "14.5 (Sonoma)",
      hostname: "MBP-DEV-JANE",
      ip: "192.168.1.24",
      region: "Île-de-France",
      country: "FR",
      updatedAt: "2025-08-31",
    },
  ]);

  // selection
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    preserveSelectedRowKeys: true,
  };

  // filters/search state
  const [hostnameSearch, setHostnameSearch] = useState("");
  const hostnameRef = useRef(null);

  const [ipSearch, setIpSearch] = useState("");
  const ipRef = useRef(null);

  const [dateRange, setDateRange] = useState(null); // filter by updatedAt

  // actions
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      // const res = await fetch("/api/activations", { credentials: "include" });
      // const json = await res.json();
      // setData(json.items);
      message.success("Refreshed");
    } catch (e) {
      console.error(e);
      message.error("Failed to refresh");
    } finally {
      setLoading(false);
    }
  };

  const deactivateSelected = async () => {
    if (selectedRowKeys.length === 0) return;
    setDeleting(true);
    try {
      // await fetch("/api/activations/bulk-deactivate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({ ids: selectedRowKeys }),
      // });
      setData((prev) => prev.filter((r) => !selectedRowKeys.includes(r.id)));
      setSelectedRowKeys([]);
      message.success("Selected activations deactivated.");
    } catch (e) {
      console.error(e);
      message.error("Failed to deactivate.");
    } finally {
      setDeleting(false);
    }
  };

  const fmtDate = (val) => (val ? dayjs(val).format("YYYY-MM-DD") : "-");

  const columns = useMemo(
    () => [
      {
        title: "OS",
        dataIndex: "os",
        key: "os",
        sorter: (a, b) =>
          (a.os || "").localeCompare(b.os || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        width: 140,
      },
      {
        title: "OS Version",
        dataIndex: "osVersion",
        key: "osVersion",
        sorter: (a, b) =>
          (a.osVersion || "").localeCompare(b.osVersion || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        width: 180,
      },
      {
        title: "Hostname",
        dataIndex: "hostname",
        key: "hostname",
        sorter: (a, b) =>
          (a.hostname || "").localeCompare(b.hostname || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        filteredValue: hostnameSearch ? [hostnameSearch] : null,
        onFilter: (val, record) =>
          (record.hostname || "")
            .toLowerCase()
            .includes(String(val).toLowerCase()),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={hostnameRef}
              placeholder="Search hostname"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                setHostnameSearch(selectedKeys[0] || "");
                confirm();
              }}
              style={{ width: 220, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setHostnameSearch(selectedKeys[0] || "");
                  confirm();
                }}
                size="small"
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters?.();
                  setSelectedKeys([]);
                  setHostnameSearch("");
                  confirm();
                }}
                size="small"
              >
                Reset
              </Button>
              <Button type="link" size="small" onClick={() => close()}>
                Close
              </Button>
            </Space>
          </div>
        ),
        width: 220,
      },
      {
        title: "IP Address",
        dataIndex: "ip",
        key: "ip",
        sorter: (a, b) =>
          (a.ip || "").localeCompare(b.ip || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        filteredValue: ipSearch ? [ipSearch] : null,
        onFilter: (val, record) =>
          (record.ip || "").toLowerCase().includes(String(val).toLowerCase()),
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={ipRef}
              placeholder="Search IP"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                setIpSearch(selectedKeys[0] || "");
                confirm();
              }}
              style={{ width: 220, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setIpSearch(selectedKeys[0] || "");
                  confirm();
                }}
                size="small"
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters?.();
                  setSelectedKeys([]);
                  setIpSearch("");
                  confirm();
                }}
                size="small"
              >
                Reset
              </Button>
              <Button type="link" size="small" onClick={() => close()}>
                Close
              </Button>
            </Space>
          </div>
        ),
        render: (val) => <span style={{ whiteSpace: "nowrap" }}>{val}</span>,
        width: 200,
      },
      {
        title: "Region",
        dataIndex: "region",
        key: "region",
        sorter: (a, b) =>
          (a.region || "").localeCompare(b.region || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        width: 180,
      },
      {
        title: "Country",
        dataIndex: "country",
        key: "country",
        sorter: (a, b) =>
          (a.country || "").localeCompare(b.country || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        width: 120,
      },
      {
        title: "Update Date",
        dataIndex: "updatedAt",
        key: "updatedAt",
        sorter: (a, b) =>
          dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
        sortDirections: ["descend", "ascend"],
        filteredValue: dateRange ? [dateRange] : null,
        onFilter: (value, record) => {
          const d = dayjs(record.updatedAt);
          if (!value || !Array.isArray(value) || value.length !== 2)
            return true;
          const [start, end] = value;
          if (!dayjs.isDayjs(start) || !dayjs.isDayjs(end)) return true;
          return (
            d.isSame(start, "day") ||
            d.isSame(end, "day") ||
            (d.isAfter(start, "day") && d.isBefore(end, "day"))
          );
        },
        filterDropdown: ({ confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <RangePicker
              allowClear
              value={dateRange}
              onChange={(v) => setDateRange(v)}
              style={{ width: 260, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button type="primary" onClick={() => confirm()} size="small">
                Apply
              </Button>
              <Button
                onClick={() => {
                  clearFilters?.();
                  setDateRange(null);
                  confirm();
                }}
                size="small"
              >
                Reset
              </Button>
              <Button type="link" size="small" onClick={() => close()}>
                Close
              </Button>
            </Space>
          </div>
        ),
        render: (val) => fmtDate(val),
        width: 170,
      },
    ],
    [hostnameSearch, ipSearch, dateRange]
  );

  const title = (
    <Space wrap>
      <Button icon={<ReloadOutlined />} onClick={refresh} loading={loading}>
        Refresh
      </Button>
      <Popconfirm
        title="Deactivate selected activations?"
        okText="Deactivate"
        okButtonProps={{ danger: true, loading: deleting }}
        onConfirm={deactivateSelected}
        disabled={selectedRowKeys.length === 0}
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          disabled={selectedRowKeys.length === 0}
          loading={deleting}
        >
          Deactivate Selected ({selectedRowKeys.length})
        </Button>
      </Popconfirm>
    </Space>
  );

  return (
    <div style={{ width: "100%" }}>
      <Table
        style={{ width: "100%" }}
        tableLayout="auto"
        rowKey="id"
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        title={() => title}
        scroll={{ x: "max-content" }} // keeps wide columns usable on mobile
      />
    </div>
  );
}
