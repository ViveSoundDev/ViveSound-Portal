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
import { MailOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { useToken } = theme;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useToken();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      // TODO: call your reset password API here
      // const res = await fetch("/api/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      message.success("Password reset link sent to your email");
      router.push("/login"); // after reset request, send back to login
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
            Forgot Password
          </Title>
          <Text type="secondary">
            Enter your email twice to confirm your request.
          </Text>
        </Space>

        <Form
          name="reset"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
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
            label="Confirm Email"
            name="confirmEmail"
            dependencies={["email"]}
            rules={[
              { required: true, message: "Please confirm your email" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("email") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two email addresses do not match")
                  );
                },
              }),
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined />}
              placeholder="re-enter your email"
              autoComplete="email"
              allowClear
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
            Send Reset Link
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
