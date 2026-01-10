# CollectHub - Enterprise Collections Management Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-3.6-FF6B6B" alt="Recharts" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-black" alt="shadcn/ui" />
</div>

---

## 📋 Overview

CollectHub is an enterprise-grade, responsive UI prototype that centralizes case allocation, tracks SOP-driven workflows & SLAs, improves recovery accountability, provides real-time dashboards, and enables structured collaboration with external Debt Collection Agencies (DCAs).

> **Note:** This is a **UI prototype** with mock data. No backend integration is included - all data is generated client-side for demonstration purposes.

---

## 🎯 Features

### Dashboard
- **KPI Cards**: Total Overdue, Recovery Rate, Avg Time to Recover, SLA Breaches, Active DCAs
- **Trend Charts**: Overdue amounts by aging bucket (0-30, 31-60, 61-90, 90+ days)
- **Collection Funnel**: Visual pipeline from New → Contacted → Negotiation → Settlement → Closed
- **DCA Leaderboard**: Performance ranking with recovery rates and SLA compliance
- **SLA Alerts**: Upcoming breach warnings with countdown timers

### Cases Management
- **Table & Card Views**: Toggle between data table and visual card layouts
- **Advanced Filters**: Aging bucket, region, DCA, priority, stage, SLA status, dispute flag
- **Bulk Actions**: Multi-select cases for batch assignment, tagging, or export
- **Inline Actions**: Quick assign, add notes, open case details
- **Pagination**: Server-like pagination with 15 items per page

### Case Detail
- **Case Summary**: Outstanding amount, expected recovery, aging days, recovery probability
- **SLA Tracking**: Visual countdown timer with deadline information
- **SOP Progress**: Stepper UI showing workflow stages with timestamps and evidence requirements
- **Activity Timeline**: Reverse chronological log of calls, emails, notes, payments
- **Documents**: Evidence attachments with preview and download capabilities
- **Audit Log**: Immutable record of all case actions
- **Quick Actions**: Log call, upload evidence, propose settlement, mark promise-to-pay, escalate

### Allocation Workbench
- **DCA Lanes**: Visual capacity bars showing active cases vs. capacity
- **Drag & Drop**: Move cases between DCAs with real-time updates
- **AI Simulation**: Predict optimal allocation based on DCA performance metrics
- **Override Logging**: Track manual reassignments with audit trail

### DCA Portal (Partner View)
- **Simplified Inbox**: Cases prioritized by SLA urgency
- **Performance Dashboard**: Personal KPIs, recovery trends, cases by stage
- **Structured Forms**: Call logging with outcome tracking and follow-up scheduling
- **Secure Messaging**: Communication thread with enterprise team

### Compliance & Audit
- **Audit Trail**: Searchable log by case, actor, date range
- **Compliance Issues**: Missing evidence alerts, SLA breaches, forbidden communications
- **Reports**: Monthly summaries, SLA compliance reports, full audit exports

### Settings
- **SOP Builder**: Drag-and-drop workflow editor with SLA timers and required artifacts
- **Roles & Permissions**: Permission matrix for Admin, DCA Agent, Compliance, Executive
- **Notifications**: Email and in-app notification preferences
- **Integrations**: Connection status for SAP, Salesforce, Twilio, DocuSign, AWS S3, Slack

---

## 👥 User Roles

| Role | Access Level |
|------|--------------|
| **Enterprise Admin** | Full access: dashboards, allocation, SOPs, audit, settings |
| **DCA Agent / Collector** | Assigned cases, activity logging, evidence upload, escalations |
| **Compliance Officer** | Audit trail, compliance flags, review templates |
| **Executive / Ops** | Summary dashboards, trends, scorecards |

Switch between roles using the user menu in the top-right corner.

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0B5FFF` | Brand, CTAs, links |
| Success | `#16A34A` | Positive status, recovery |
| Warning | `#F59E0B` | Caution, SLA warnings |
| Destructive | `#DC2626` | Errors, breaches |
| Background | `#F8FAFC` | Page background |
| Surface | `#FFFFFF` | Cards, modals |

### Typography
- **Font**: Inter (400, 500, 600, 700 weights)
- **Headings**: 24-28px (h1), 20-22px (h2)
- **Body**: 14-16px

### Components
- shadcn/ui primitives for accessibility
- Custom KPI cards with gradient accents
- SLA badges (green/yellow/red) with tooltips
- Priority strips on case cards
- Activity timeline with icons

---

## 🗂️ Project Structure

```
/app/frontend/src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx       # Main app shell
│   │   ├── Sidebar.jsx      # Collapsible navigation
│   │   └── TopBar.jsx       # Header with search, notifications
│   └── ui/                  # shadcn/ui components
├── context/
│   └── AppContext.js        # Global state management
├── data/
│   └── mockData.js          # 100 synthetic cases, DCAs, KPIs
├── pages/
│   ├── Dashboard.jsx        # KPIs, charts, leaderboard
│   ├── CasesList.jsx        # Table/card view with filters
│   ├── CaseDetail.jsx       # Case overview, timeline, actions
│   ├── Allocation.jsx       # Drag-drop workbench
│   ├── DCAPortal.jsx        # Partner inbox and dashboard
│   ├── Compliance.jsx       # Audit trail and issues
│   └── Settings.jsx         # SOP builder, permissions
├── App.js                   # Router configuration
└── index.css                # Design tokens, custom styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Yarn package manager

### Installation

```bash
# Navigate to frontend directory
cd /app/frontend

# Install dependencies
yarn install

# Start development server
yarn start
```

The app will be available at `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start development server |
| `yarn build` | Create production build |
| `yarn test` | Run test suite |

---

## 📊 Mock Data

The prototype includes **100 synthetic cases** with realistic attributes:

```json
{
  "case_id": "C-2026-0001",
  "customer": {
    "name": "Acme Logistics Pvt Ltd",
    "customer_id": "CU-00938",
    "region": "Chennai"
  },
  "outstanding_amount": 12450.75,
  "currency": "INR",
  "aging_days": 62,
  "priority": "HIGH",
  "assigned_dca": "Atlas Recovery Co",
  "stage": "Negotiation",
  "expected_recovery": 9800,
  "p_recover": 0.79,
  "sla_deadline": "2026-01-13T11:00:00+05:30",
  "dispute_flag": false,
  "evidence": [...],
  "activities": [...],
  "sop_progress": [...]
}
```

### DCA Data
6 debt collection agencies with capacity, recovery rates, and SLA compliance metrics.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Tailwind CSS 3.4 | Utility-first styling |
| shadcn/ui | Accessible component primitives |
| Recharts 3.6 | Data visualization |
| @dnd-kit | Drag and drop |
| Framer Motion | Animations |
| React Router 7 | Navigation |
| Lucide React | Icons |
| Sonner | Toast notifications |

---

## 📱 Responsive Design

The UI is optimized for:
- **Desktop**: Full dashboard with sidebar navigation (1920px+)
- **Tablet**: Condensed layouts with collapsible sidebar (768px-1919px)
- **Mobile**: Simplified case list and quick actions (<768px)

---

## 🔮 Future Enhancements

- [ ] Backend API integration (FastAPI)
- [ ] MongoDB database connectivity
- [ ] Real authentication (OAuth 2.0)
- [ ] WebSocket for real-time updates
- [ ] PDF report generation
- [ ] Email/SMS notification integration
- [ ] Advanced analytics with AI insights

---

## 📄 License

This project is proprietary and intended for demonstration purposes only.

---

<div align="center">
  <p>Built with ❤️ for enterprise collections management</p>
</div>
