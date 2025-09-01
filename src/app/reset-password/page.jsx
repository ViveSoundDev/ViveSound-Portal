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
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useToken();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ password }) => {
    setLoading(true);
    try {
      // TODO: call your backend reset endpoint here with the new password
      // e.g. fetch("/api/reset-password", { method: "POST", body: JSON.stringify({ password, token: resetToken }) })

      message.success("Password updated successfully");
      router.push("/login"); // redirect to login after reset
    } catch (err) {
      message.error(err.message || "Something went wrong");
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
            Create New Password
          </Title>
          <Text type="secondary">
            Please enter your new password twice to confirm.
          </Text>
        </Space>

        <Form
          name="reset-password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Please enter a new password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<CheckCircleOutlined />}
            loading={loading}
            block
            style={{ borderRadius: 10 }}
          >
            Reset Password
          </Button>
        </Form>

        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          <Text type="secondary">
            <a href="/">Back to login</a>
          </Text>
        </div>
      </Card>
    </div>
  );
}
