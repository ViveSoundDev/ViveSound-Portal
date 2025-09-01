"use client";

import React from "react";
import "../styles/users-page.scss";
import SidebarLayout from "../components/Navbar";
import UsersTable from "../components/UsersTable";

export default function UsersPage() {
  return (
    <SidebarLayout>
      <div className="users-page">
        <UsersTable />
      </div>
    </SidebarLayout>
  );
}
