# ScholarLink: Scholarship Opportunity Intelligence Engine

> **Discover. Explain. Verify. Assist.**

ScholarLink transforms the traditional "Search and Apply" scholarship workflow into an intelligent, transparent journey: **Discover → Understand → Apply → Verify → Track**.

Built to government/education-platform quality standards with intelligent eligibility matching, plain-language requirement explanations, automated OCR document validation, and role-based access control (RBAC).

---

## 🚀 Instant Vercel Deployment

This repository is pre-configured for **zero-config deployment on Vercel**:

1. Import this repository (`https://github.com/seethaladevi2024-cpu/Scholorlink_project`) into your [Vercel Dashboard](https://vercel.com/new).
2. Leave all default settings as they are:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or `frontend`)
   - **Build Command:** `cd frontend && npm install && npm run build` (automatic via `vercel.json`)
   - **Output Directory:** `frontend/dist`
3. Click **Deploy**.
4. Your production website will be published immediately with full interactive capabilities, responsive layouts, and zero runtime errors!

---

## 🌟 Key Product Features

### 1. Student Registration & Profile Intake (8 Mandatory Fields)
- Full Legal Name
- Gender (Male, Female, Other, Prefer not to say)
- Date of Birth (DatePicker)
- Phone Number (10-digit validation)
- Email ID (Format validated)
- Candidate Application Number (CAN)
- Caste Category (General, OBC, SC, ST, EWS, Minority)
- Community Classification
- **Google Sheets Synchronization:** Secure server-side destination telemetry configured for Sheet ID `1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg`.

### 2. Intelligent Eligibility Matching Engine
- Multi-weighted criteria evaluation comparing candidate community, income ceiling, academic marks, and eligible course discipline against gazetted scheme rules.
- Generates transparent, human-readable explanations:
  - **✓ Why you match:** Positive verified criteria with rationale.
  - **⚠ Missing / uncertain info:** Actionable guidance on required documents.
  - **Compliance Disclaimers:** Official notice that match results are preliminary subject to revenue authority verification.

### 3. Document Vault & Automated OCR Engine
- Secure upload for Income, Community/Caste, Academic Marksheets, Identity, and Bank Details.
- Automated text extraction parsing certificate serial numbers, beneficiary name, issuing authority, and digital seal hashes.
- Confidence scoring with safety thresholds (e.g. 96.4% Verified vs. 61.5% Needs Review) routing degraded scans to the human verification queue.

### 4. Application Lifecycle Tracking
- Visual 5-stage progress indicator: **Discover → Understand → Apply → Verify → Track**.
- Real-time status badges, application audit trails, and Direct Benefit Transfer (DBT) verification readiness.

### 5. Admin & Verification Portal
- Role-Based Access Control (`STUDENT`, `VERIFIER`, `ADMIN`).
- Summary KPI analytics: Total Applications, Pending Verification, Documents Requiring Review, Potential Mismatches, and Uncertain AI Cases.
- **Verification Queue:** Human-in-the-loop review for flagged scans with actions to **Review**, **Approve**, **Request Correction**, or **Reject**.
- **Centralized Knowledge Base:** Version-controlled rules management with audit timestamps.

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend:** Python, FastAPI, Pydantic v2, SQLAlchemy, JWT Authentication, Bcrypt
- **Cloud & Deployment:** Vercel (Frontend & SPA Rewrites), GitHub, Google Sheets API / Webhook Integration

---

## 👥 Demo Review Credentials

| Role | Login Identifier | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `rahul.verma@example.edu` or `CAN-2025-98241` | `student123` | Discovery, AI Explanation, Documents, Tracking |
| **Verifier** | `officer.sharma@scholarlink.gov.in` | `verifier123` | Verification queue, manual audits, approve/reject |
| **Admin** | `admin@scholarlink.gov.in` | `admin123` | Full portal oversight, rules knowledge base |

*(Use the **Role Switcher** in the top navigation bar to toggle between Student, Verifier, and Admin perspectives instantly).*

---

## 📄 License
© ScholarLink Intelligence Engine. All official rights reserved.
