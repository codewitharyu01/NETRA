import { useState, useEffect } from "react";

import { 
  LayoutDashboard,
  FolderKanban,
  Building2,
  FileText,
  MessageSquareWarning,
  ClipboardCheck,
  TrendingUp,
  Wallet,
  Package,
  Users,
  Files,
  Camera,
  Bell,
  UserCog,
  History,
  Settings,
  Search,
  ChevronDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  IndianRupee,
  Menu,
  MapPin,
} from "lucide-react";

import "./index.css";
import Login from "./Login";

const progressData = [
  { month: "Apr", planned: 18, actual: 16 },
  { month: "May", planned: 30, actual: 27 },
  { month: "Jun", planned: 45, actual: 41 },
  { month: "Jul", planned: 60, actual: 55 },
  { month: "Aug", planned: 72, actual: 67 },
  { month: "Sep", planned: 84, actual: 78 },
  { month: "Oct", planned: 100, actual: 91 },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(
  !!localStorage.getItem("netra_token")
);

const [officer, setOfficer] = useState(() => {
  const savedOfficer = localStorage.getItem("netra_officer");

  return savedOfficer
    ? JSON.parse(savedOfficer)
    : null;
});

const [dashboardStats, setDashboardStats] = useState(null);
const [statsLoading, setStatsLoading] = useState(true);

const [projects, setProjects] = useState([]);
const [projectsLoading, setProjectsLoading] = useState(true);

useEffect(() => {
  if (!loggedIn) return;

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("netra_token");

      const response = await fetch(
        "http://127.0.0.1:8000/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();

      setDashboardStats(data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  fetchDashboardStats();
}, [loggedIn]);

if (!loggedIn) {
  return (
    <Login
      onLogin={(officerData) => {
        setOfficer(officerData);
        setLoggedIn(true);
      }}
    />
  );
}

useEffect(() => {
  if (!loggedIn) return;

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("netra_token");

      const response = await fetch(
        "http://127.0.0.1:8000/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.error("Projects error:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  fetchProjects();
}, [loggedIn]);
  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">G</div>

          <div>
            <h2>NETRA</h2>
            <span>Transparency Portal</span>
          </div>
        </div>

        <div className="nav-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">

          <a className="nav-item active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>

          <a className="nav-item">
            <FolderKanban size={19} />
            <span>Projects</span>
          </a>

          <a className="nav-item">
            <Building2 size={19} />
            <span>Contractors</span>
          </a>

          <a className="nav-item">
            <FileText size={19} />
            <span>Contracts & Tenders</span>
          </a>

          <a className="nav-item">
            <MessageSquareWarning size={19} />
            <span>Complaints</span>
            <span className="nav-badge">12</span>
          </a>

          <a className="nav-item">
            <ClipboardCheck size={19} />
            <span>Inspections</span>
            <span className="nav-badge warning">5</span>
          </a>

          <a className="nav-item">
            <TrendingUp size={19} />
            <span>Progress Monitoring</span>
          </a>

          <a className="nav-item">
            <Wallet size={19} />
            <span>Budget & Payments</span>
          </a>

          <a className="nav-item">
            <Package size={19} />
            <span>Materials</span>
          </a>

          <a className="nav-item">
            <Users size={19} />
            <span>Labour</span>
          </a>

          <a className="nav-item">
            <Files size={19} />
            <span>Documents & Reports</span>
          </a>

          <a className="nav-item">
            <Camera size={19} />
            <span>Evidence</span>
          </a>

          <a className="nav-item">
            <Bell size={19} />
            <span>Notifications</span>
            <span className="nav-badge">7</span>
          </a>

          <div className="nav-section-title second">
            ADMINISTRATION
          </div>

          <a className="nav-item">
            <UserCog size={19} />
            <span>Users & Roles</span>
          </a>

          <a className="nav-item">
            <History size={19} />
            <span>Audit Logs</span>
          </a>

          <a className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </a>

        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>
        </div>

      </aside>


      {/* MAIN */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="header-left">

            <button className="menu-button">
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              <span>Government Administration</span>
              <b>/</b>
              <strong>Dashboard</strong>
            </div>

          </div>

          <div className="header-right">

            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search projects, complaints..."
              />
            </div>

            <button className="notification-button">
              <Bell size={20} />
              <span></span>
            </button>

            <div className="profile">

              <div className="profile-avatar">
                GO
              </div>

              <div className="profile-info">
                <strong>Government Officer</strong>
                <small>Public Works Department</small>
              </div>

              <ChevronDown size={17} />

            </div>

          </div>

        </header>


        {/* CONTENT */}
        <div className="content">

          <div className="page-heading">

            <div>
              <h1>Government Construction Dashboard</h1>

              <p>
                Monitor construction projects, budgets, inspections
                and public complaints.
              </p>
            </div>

            <div className="date-box">
              <span>Current Date</span>
              <strong>28 August 2026</strong>
            </div>

          </div>


          {/* STATISTICS */}
          <section className="stats-grid">

            <StatCard
              icon={<FolderKanban size={20} />}
              title="Total Projects"
              value={
  statsLoading
    ? "..."
    : dashboardStats?.total_projects ?? 0
}
subtitle="Registered projects"
              type="blue"
            />

            <StatCard
              icon={<TrendingUp size={20} />}
              title="Ongoing Projects"
              value={
  statsLoading
    ? "..."
    : dashboardStats?.ongoing_projects ?? 0
}
subtitle="Currently ongoing"
              type="blue"
            />

            <StatCard
              icon={<CheckCircle2 size={20} />}
              title="Completed Projects"
              value={
  statsLoading
    ? "..."
    : dashboardStats?.completed_projects ?? 0
}
subtitle="Successfully completed"
              type="green"
            />

            <StatCard
              icon={<AlertTriangle size={20} />}
              title="Delayed Projects"
              value="13"
              subtitle="Requires attention"
              type="red"
            />

            <StatCard
              icon={<IndianRupee size={20} />}
              title="Approved Budget"
              value={
  statsLoading
    ? "..."
    : `₹${((dashboardStats?.total_approved_budget ?? 0) / 10000000).toFixed(2)} Cr`
}
subtitle="Total approved budget"
              type="blue"
            />

            <StatCard
              icon={<Wallet size={20} />}
              title="Amount Utilized"
              value="₹286.4 Cr"
              subtitle="63.5% utilized"
              type="green"
            />

            <StatCard
              icon={<MessageSquareWarning size={20} />}
              title="Pending Complaints"
              value="27"
              subtitle="12 high priority"
              type="orange"
            />

            <StatCard
              icon={<ClipboardCheck size={20} />}
              title="Pending Inspections"
              value="14"
              subtitle="Requires action"
              type="orange"
            />

          </section>


          {/* STATUS + FINANCE */}
          <section className="analytics-grid">

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Project Status</h2>
                  <p>Current status of registered projects</p>
                </div>

              </div>

              <div className="project-status">

                <div className="status-visual">
                  <div className="donut">

                    <div>
                      <strong>128</strong>
                      <span>Projects</span>
                    </div>

                  </div>
                </div>

                <div className="status-list">

                  <StatusRow
                    label="Ongoing"
                    value="84"
                    percentage="65.6%"
                    type="blue"
                  />

                  <StatusRow
                    label="Completed"
                    value="31"
                    percentage="24.2%"
                    type="green"
                  />

                  <StatusRow
                    label="Delayed"
                    value="13"
                    percentage="10.2%"
                    type="red"
                  />

                </div>

              </div>

            </div>


            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Financial Overview</h2>
                  <p>Project budget utilization</p>
                </div>

              </div>

              <div className="financial-list">

                <FinancialRow
                  label="Approved Budget"
                  amount="₹450.8 Cr"
                  percentage="100%"
                  width="100%"
                  type="blue"
                />

                <FinancialRow
                  label="Contracted Amount"
                  amount="₹398.2 Cr"
                  percentage="88.3%"
                  width="88%"
                  type="blue"
                />

                <FinancialRow
                  label="Amount Paid"
                  amount="₹286.4 Cr"
                  percentage="63.5%"
                  width="64%"
                  type="green"
                />

                <FinancialRow
                  label="Remaining"
                  amount="₹111.8 Cr"
                  percentage="24.8%"
                  width="25%"
                  type="orange"
                />

              </div>

            </div>

          </section>


          {/* NEW PROGRESS GRAPH */}
          <section className="panel progress-panel">

            <div className="panel-header progress-header">

              <div>
                <h2>Project Progress & Work Completion</h2>

                <p>
                  Planned vs actual construction progress
                </p>
              </div>

              <div className="progress-summary">

                <div>
                  <span>Current Progress</span>
                  <strong>78%</strong>
                </div>

                <div>
                  <span>Target</span>
                  <strong>84%</strong>
                </div>

                <div className="progress-gap">
                  <span>Progress Gap</span>
                  <strong>-6%</strong>
                </div>

              </div>

            </div>


            <div className="chart-container">

              <div className="chart-y-axis">
                <span>100%</span>
                <span>80%</span>
                <span>60%</span>
                <span>40%</span>
                <span>20%</span>
                <span>0%</span>
              </div>


              <div className="chart-area">

                <div className="chart-grid-lines">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>


                <div className="chart-lines">

                  <svg
                    viewBox="0 0 700 280"
                    preserveAspectRatio="none"
                  >

                    {/* Planned line */}
                    <polyline
                      points="0,230 116,196 233,154 350,112 466,78 583,45 700,0"
                      fill="none"
                      stroke="#1f5a94"
                      strokeWidth="3"
                    />

                    {/* Actual line */}
                    <polyline
                      points="0,235 116,204 233,165 350,126 466,93 583,61 700,25"
                      fill="none"
                      stroke="#198754"
                      strokeWidth="3"
                    />

                    {/* Planned points */}
                    {progressData.map((item, index) => {

                      const x = index * (700 / 6);
                      const y = 280 - (item.planned / 100) * 280;

                      return (
                        <circle
                          key={`planned-${item.month}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="white"
                          stroke="#1f5a94"
                          strokeWidth="3"
                        />
                      );
                    })}

                    {/* Actual points */}
                    {progressData.map((item, index) => {

                      const x = index * (700 / 6);
                      const y = 280 - (item.actual / 100) * 280;

                      return (
                        <circle
                          key={`actual-${item.month}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="white"
                          stroke="#198754"
                          strokeWidth="3"
                        />
                      );
                    })}

                  </svg>

                </div>


                <div className="chart-x-axis">

                  {progressData.map((item) => (
                    <span key={item.month}>
                      {item.month}
                    </span>
                  ))}

                </div>

              </div>

            </div>


            <div className="chart-legend">

              <div>
                <span className="legend-line planned"></span>
                Planned Progress
              </div>

              <div>
                <span className="legend-line actual"></span>
                Actual Progress
              </div>

              <div className="legend-note">
                Actual progress is 6% behind the current target.
              </div>

            </div>

          </section>


          {/* PROJECT TABLE */}
          <section className="panel table-panel">

            <div className="panel-header">

              <div>
                <h2>Active & Delayed Projects</h2>
                <p>Projects requiring regular monitoring</p>
              </div>

              <button className="view-button">
                View All Projects
              </button>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>Project ID</th>
                    <th>Project Name</th>
                    <th>Location</th>
                    <th>Contractor</th>
                    <th>Budget</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

  {projectsLoading ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
        Loading projects...
      </td>
    </tr>
  ) : projects.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
        No projects found
      </td>
    </tr>
  ) : (
    projects.map((project) => (
      <ProjectRow
        key={project.id}
        id={project.project_id}
        name={project.project_name}
        location={project.location}
        contractor={project.contractor}
        budget={`₹${(project.approved_budget / 10000000).toFixed(2)} Cr`}
        progress={`${project.progress}%`}
        status={project.status}
        type={
          project.status === "Delayed"
            ? "red"
            : project.status === "Completed"
            ? "green"
            : "blue"
        }
      />
    ))
  )}

</tbody>

              </table>

            </div>

          </section>


          {/* COMPLAINTS + INSPECTIONS */}
          <section className="bottom-grid">

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Complaints Requiring Action</h2>
                  <p>Recent complaints assigned for review</p>
                </div>

                <button className="view-button">
                  View All
                </button>

              </div>

              <div className="complaint-list">

                <Complaint
                  id="CMP-1024"
                  project="Rural Road Development"
                  category="Construction Quality"
                  priority="High"
                  status="Under Investigation"
                  type="red"
                />

                <Complaint
                  id="CMP-1025"
                  project="Bridge Construction"
                  category="Project Delay"
                  priority="Medium"
                  status="Assigned"
                  type="orange"
                />

                <Complaint
                  id="CMP-1026"
                  project="Village Road Improvement"
                  category="Road Damage"
                  priority="Critical"
                  status="Escalated"
                  type="red"
                />

              </div>

            </div>


            <div className="panel">

              <div className="panel-header">

                <div>
                  <h2>Upcoming Inspections</h2>
                  <p>Scheduled government inspections</p>
                </div>

                <button className="view-button">
                  View All
                </button>

              </div>

              <div className="inspection-list">

                <Inspection
                  id="INS-2041"
                  project="Rural Road Development"
                  inspector="R. Sharma"
                  date="28 Aug"
                  type="Quality Inspection"
                  status="Today"
                />

                <Inspection
                  id="INS-2042"
                  project="Bridge Construction"
                  inspector="A. Verma"
                  date="29 Aug"
                  type="Progress Inspection"
                  status="Tomorrow"
                />

                <Inspection
                  id="INS-2043"
                  project="Water Pipeline Project"
                  inspector="S. Kumar"
                  date="31 Aug"
                  type="Final Inspection"
                  status="Upcoming"
                />

              </div>

            </div>

          </section>


          {/* ALERTS */}
          <section className="panel alerts-panel">

            <div className="panel-header">

              <div>
                <h2>Important Alerts</h2>
                <p>Items requiring government attention</p>
              </div>

            </div>

            <div className="alerts-grid">

              <Alert
                icon={<AlertTriangle size={19} />}
                title="Delayed Project"
                description="RD-2026-019 is 18 days behind schedule."
                type="red"
              />

              <Alert
                icon={<Clock size={19} />}
                title="Inspection Due"
                description="INS-2041 is scheduled for today."
                type="orange"
              />

              <Alert
                icon={<MessageSquareWarning size={19} />}
                title="Complaint Review"
                description="12 high-priority complaints require action."
                type="orange"
              />

            </div>

          </section>


          <footer className="footer">

            <span>
              Government Construction Transparency Portal
            </span>

            <span>
              Government Administration System • Version 1.0.0
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}


/* STAT CARD */

function StatCard({
  icon,
  title,
  value,
  subtitle,
  type
}) {

  return (
    <div className="stat-card">

      <div className={`stat-icon ${type}`}>
        {icon}
      </div>

      <div className="stat-content">

        <span>{title}</span>

        <strong>{value}</strong>

        <small>{subtitle}</small>

      </div>

    </div>
  );
}


/* STATUS ROW */

function StatusRow({
  label,
  value,
  percentage,
  type
}) {

  return (
    <div className="status-row">

      <div className="status-row-top">

        <span>
          <i className={`status-dot-small ${type}`}></i>
          {label}
        </span>

        <strong>{value}</strong>

      </div>

      <div className="status-bar">

        <div
          className={`status-fill ${type}`}
          style={{
            width: percentage
          }}
        ></div>

      </div>

      <small>{percentage}</small>

    </div>
  );
}


/* FINANCIAL ROW */

function FinancialRow({
  label,
  amount,
  percentage,
  width,
  type
}) {

  return (
    <div className="financial-row">

      <div className="financial-top">

        <span>{label}</span>

        <strong>{amount}</strong>

      </div>

      <div className="financial-bar">

        <div
          className={`financial-fill ${type}`}
          style={{
            width
          }}
        ></div>

      </div>

      <small>{percentage}</small>

    </div>
  );
}


/* PROJECT ROW */

function ProjectRow({
  id,
  name,
  location,
  contractor,
  budget,
  progress,
  status,
  type
}) {

  return (
    <tr>

      <td>
        <strong className="project-id">
          {id}
        </strong>
      </td>

      <td>
        <strong>{name}</strong>
      </td>

      <td>
        <span className="location-cell">
          <MapPin size={12} />
          {location}
        </span>
      </td>

      <td>{contractor}</td>

      <td>
        <strong>{budget}</strong>
      </td>

      <td>

        <div className="table-progress">

          <div className="progress-track">

            <div
              className={`progress-value ${type}`}
              style={{
                width: progress
              }}
            ></div>

          </div>

          <span>{progress}</span>

        </div>

      </td>

      <td>

        <span className={`status-badge ${type}`}>
          {status}
        </span>

      </td>

    </tr>
  );
}


/* COMPLAINT */

function Complaint({
  id,
  project,
  category,
  priority,
  status,
  type
}) {

  return (
    <div className="complaint-item">

      <div className={`item-icon ${type}`}>
        <MessageSquareWarning size={18} />
      </div>

      <div className="item-content">

        <div className="item-title">

          <strong>{id}</strong>

          <span className={`priority ${type}`}>
            {priority}
          </span>

        </div>

        <p>{project}</p>

        <small>
          {category} • {status}
        </small>

      </div>

      <ChevronDown
        size={17}
        className="item-arrow"
      />

    </div>
  );
}


/* INSPECTION */

function Inspection({
  id,
  project,
  inspector,
  date,
  type,
  status
}) {

  return (
    <div className="inspection-item">

      <div className="date-box-small">

        <strong>
          {date.split(" ")[0]}
        </strong>

        <span>
          AUG
        </span>

      </div>

      <div className="item-content">

        <div className="item-title">

          <strong>{id}</strong>

          <span className="inspection-status">
            {status}
          </span>

        </div>

        <p>{project}</p>

        <small>
          {type} • Inspector: {inspector}
        </small>

      </div>

    </div>
  );
}


/* ALERT */

function Alert({
  icon,
  title,
  description,
  type
}) {

  return (
    <div className={`alert-card ${type}`}>

      <div className="alert-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>

        <p>{description}</p>
      </div>

    </div>
  );
}

export default App;