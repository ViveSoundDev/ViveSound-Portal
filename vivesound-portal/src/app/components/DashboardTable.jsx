"use client";

import React, { useMemo, useState, useRef } from "react";
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
const { useBreakpoint } = Grid;
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../styles/dashboard-page.scss";

const { RangePicker } = DatePicker;

export default function DashboardTable() {
  const screens = useBreakpoint();
  const isMobile = !screens.sm;
  // ----- Data -----
  const [data, setData] = useState([
    { id: "u_1", email: "alice@example.com", dateAdded: "2025-08-01" },
    { id: "u_2", email: "bob@example.com", dateAdded: "2025-08-12" },
  ]);

  // ----- Selection -----
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    preserveSelectedRowKeys: true,
    getCheckboxProps: (record) => ({
      disabled: record.id === "__create__", // don't allow selecting the input row
    }),
  };

  // ----- Create (toggled by button) -----
  const [showCreate, setShowCreate] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [creating, setCreating] = useState(false);

  const resetCreate = () => {
    setNewEmail("");
    setShowCreate(false);
  };

  const handleCreate = async () => {
    if (!newEmail?.trim()) return message.warning("Please enter an email.");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    if (!emailOk) return message.error("Invalid email format.");

    const dateStr = dayjs().format("YYYY-MM-DD"); // auto-set to today
    setCreating(true);
    try {
      // TODO: POST to your API
      setData((prev) => [
        { id: `u_${Date.now()}`, email: newEmail.trim(), dateAdded: dateStr },
        ...prev,
      ]);
      message.success("Person created.");
      resetCreate();
    } catch (e) {
      console.error(e);
      message.error("Failed to create person.");
    } finally {
      setCreating(false);
    }
  };

  // ----- Delete selected -----
  const [deleting, setDeleting] = useState(false);
  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) return;
    setDeleting(true);
    try {
      // TODO: call your API
      setData((prev) =>
        prev.filter((row) => !selectedRowKeys.includes(row.id))
      );
      setSelectedRowKeys([]);
      message.success("Selected people deleted.");
    } catch (e) {
      console.error(e);
      message.error("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  // ----- Filters state -----
  const [emailSearch, setEmailSearch] = useState("");
  const emailInputRef = useRef(null);

  const [dateRange, setDateRange] = useState(null); // [dayjs, dayjs] | null

  // Helpers
  const normalizeDate = (val) => (val ? dayjs(val).format("YYYY-MM-DD") : "-");

  // ----- Columns (with sorters & filters) -----
  const columns = useMemo(
    () => [
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ellipsis: true,
        sorter: (a, b) =>
          (a.email || "").localeCompare(b.email || "", undefined, {
            sensitivity: "base",
          }),
        sortDirections: ["ascend", "descend"],
        filteredValue: emailSearch ? [emailSearch] : null,
        onFilter: (value, record) => {
          if (record.id === "__create__") return true; // keep create row visible
          const hay = (record.email || "").toLowerCase();
          return hay.includes(String(value).toLowerCase());
        },
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          close,
        }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={emailInputRef}
              placeholder="Search email"
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                setEmailSearch(selectedKeys[0] || "");
                confirm();
              }}
              style={{ width: 220, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => {
                  setEmailSearch(selectedKeys[0] || "");
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
                  setEmailSearch("");
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
        filterIcon: (filtered) => (
          <SearchOutlined style={{ opacity: filtered ? 1 : 0.4 }} />
        ),
        render: (val, record) => {
          if (record.id === "__create__") {
            return (
              <Space
                direction={isMobile ? "vertical" : "horizontal"}
                style={{ width: isMobile ? "100%" : "auto", maxWidth: 520 }}
              >
                <Input
                  autoFocus
                  placeholder="user@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onPressEnter={handleCreate}
                  style={{ width: isMobile ? "100%" : 340 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  loading={creating}
                  style={{ width: isMobile ? "100%" : "auto" }}
                >
                  Submit
                </Button>
                <Button
                  onClick={resetCreate}
                  style={{ width: isMobile ? "100%" : "auto" }}
                >
                  Cancel
                </Button>
              </Space>
            );
          }
          return val;
        },
      },
      {
        title: "Date Added",
        dataIndex: "dateAdded",
        key: "dateAdded",
        sorter: (a, b) =>
          dayjs(a.dateAdded).valueOf() - dayjs(b.dateAdded).valueOf(),
        sortDirections: ["descend", "ascend"],
        filteredValue: dateRange ? [dateRange] : null,
        onFilter: (value, record) => {
          if (record.id === "__create__") return true; // keep create row visible
          const d = dayjs(record.dateAdded);
          if (!value || !Array.isArray(value) || value.length !== 2)
            return true;
          const [start, end] = value;
          if (!dayjs.isDayjs(start) || !dayjs.isDayjs(end)) return true;
          // inclusive range
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
        render: (val, record) =>
          record.id === "__create__" ? "-" : normalizeDate(val),
      },
    ],
    [emailSearch, dateRange, newEmail, creating]
  );

  // Inject the create row only when toggled on
  const dataWithCreateRow = useMemo(
    () => (showCreate ? [{ id: "__create__" }, ...data] : data),
    [showCreate, data]
  );

  // ----- Table header actions -----
  const tableTitle = (
    <Space wrap>
      <Button
        type={showCreate ? "default" : "primary"}
        icon={<PlusOutlined />}
        onClick={() => setShowCreate((s) => !s)}
      >
        {showCreate ? "Create Person (open)" : "Create Person"}
      </Button>

      <Popconfirm
        title="Delete selected people?"
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleting }}
        onConfirm={handleDeleteSelected}
        disabled={selectedRowKeys.length === 0}
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          disabled={selectedRowKeys.length === 0}
          loading={deleting}
        >
          Delete Selected ({selectedRowKeys.length})
        </Button>
      </Popconfirm>
    </Space>
  );

  return (
    <Table
      rowKey="id"
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataWithCreateRow}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      title={() => tableTitle}
      onChange={(_, __, ___) => {
        // keeping this here if you later want to react to sorter/filter changes
      }}
    />
  );
}
