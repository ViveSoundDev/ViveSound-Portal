"use client";

import React from "react";
import DashboardTable from "../components/DashboardTable";
import "../styles/dashboard-page.scss";
import SidebarLayout from "../components/Navbar";

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="dashboard">
        <DashboardTable />
      </div>
    </SidebarLayout>
  );
}
