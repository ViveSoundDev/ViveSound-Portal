"use client";

import React from "react";
import { Button, Typography, Card, Space } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import "../styles/my-account.scss";

const { Title, Paragraph, Text } = Typography;

export default function AccountPage() {
  const paymentPortalUrl = "https://your-payment-portal.com"; // 🔗 replace

  return (
    <div className="my-account">
      <Card
        bordered
        style={{ maxWidth: 600, margin: "0 auto" }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            My Account
          </Title>

          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Manage your subscription, update payment methods, and view your
            invoices securely in our payment partner’s portal.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            block
            icon={<CreditCardOutlined />}
            href={paymentPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Payment Portal
          </Button>

          <Text type="secondary" style={{ fontSize: 12 }}>
            This will open a secure external page.
          </Text>
        </Space>
      </Card>
    </div>
  );
}
