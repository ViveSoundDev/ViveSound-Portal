"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  theme,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

export default function LoginPage() {
  const router = useRouter();
  const { token } = useToken();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // let browser store the HttpOnly cookie
      });

      const data = await res.json();
console.log("LOGIN: ", res)
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      message.success("Logged in");
      router.push("/users");
    } catch (err) {
      message.error(err.errorMessage || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: `linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorFillAlter} 100%)`,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: `1px solid ${token.colorSplit}`,
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Title level={3} style={{ margin: 0 }}>
            Welcome back
          </Title>
          <Text type="secondary">Sign in to access your dashboard.</Text>
        </Space>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="on"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="you@example.com"
              autoComplete="email"
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
            style={{ borderRadius: 10 }}
          >
            Sign in
          </Button>
        </Form>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
          }}
        >
          <Text type="secondary">
            <a href="/forgot-password">Forgot password?</a>
          </Text>
          <Text type="secondary">
            Don't have an account? <a href="/signup">Get Started</a>
          </Text>
        </div>
      </Card>
    </div>
  );
}
