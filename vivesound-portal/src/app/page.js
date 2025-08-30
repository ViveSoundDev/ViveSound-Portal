import DashboardTable from "./components/DashboardTable";
import "./styles/dashboard-page.scss";

export default function Home() {
  return (
    <div className="dashboard">
      <div className="header">
        <h1>DASHBOARD</h1>
      </div>
      <DashboardTable />
    </div>
  );
}
