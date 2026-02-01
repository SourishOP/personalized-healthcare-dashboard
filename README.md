# Personalized Healthcare Dashboard

## 1. Vision Document

### Project Name & Overview
**Project Name**: Personalized Health Dashboard 
**Overview**: A centralized, secure, and HIPAA-compliant platform for individuals to aggregate their health data (vitals, medications, logs) and allow secure access for caregivers and healthcare providers.

### Problem it Solves
- **Fragmentation**: Health data is scattered across different apps and paper records.
- **Privacy**: Lack of secure, user-controlled sharing mechanisms for sensitive health data.
- **Compliance**: Many health apps do not meet HIPAA standards for security (audit, encryption).

### Target Users (Personas)
1.  **Alex (The Patient)**: Needs to track daily blood pressure and ensure their doctor sees the trends.
2.  **Dr. Smith (The Provider)**: Needs a quick, secure way to view patient logs without manual data entry.
3.  **Sarah (The Caregiver)**: Monitors her elderly parent's medication adherence.

### Vision Statement
"To empower individuals with complete ownership of their health data through a secure, transparent, and interoperable digital dashboard."

### Key Features / Goals
- **Secure Auth**: Multi-Factor Authentication (MFA) and granular Role-Based Access Control (RBAC).
- **Data Sovereignty**: Row-Level Security ensuring users own their data.
- **Interoperability**: Standardized APIs for fitness tracker integration.
- **Compliance**: Built-in audit logs and encryption at rest.

### Success Metrics
- 99.9% uptime for data availability.
- < 1 second latency for fetching health history.
- Zero security breaches (measured by vulnerability scans).

### Assumptions & Constraints
- **Assumptions**: Users have access to smartphones for MFA. Google Fit/Apple Health allow API access.
- **Constraints**: Must run on low-cost cloud infrastructure. 10GB storage limit per free-tier tenant.

---

## 5. Dev Setup & Documentation

### GitHub Repository Structure
- `/backend`: Node.js/Express API & Database Scripts.
- `/frontend`: Vue.js 3 + Vite Application.
- `docker-compose.yml`: Orchestration for full stack.
- `.github/workflows`: CI/CD pipelines.

### Branching Strategy (GitHub Flow)
We follow **GitHub Flow** for simplicity and continuous delivery:
1.  **`main`**: The production-ready code. Always deployable.
2.  **Feature Branches**: Created from `main` (naming: `feature/auth-module`, `fix/login-bug`).
3.  **Pull Requests**: Merged back into `main` after CI checks pass.

### Local Development Tools
- **Code Editor**: VS Code (with ESLint, Prettier, Docker extensions).
- **Runtime**: Node.js v18 (LTS).
- **Containerization**: Docker Desktop (v4.x+).
- **API Testing**: Postman or Curl.
- **Database GUI**: DBeaver or PGAdmin.

### Quick Start – Local Development
**Prerequisites**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1.  **Clone & Configure**:
    ```bash
    git clone <repo-url>
    cd healthcare-dashboard
    cp backend/.env.example backend/.env
    ```

2.  **Run with Docker**:
    ```bash
    docker compose up --build
    ```
    *Builds the frontend and backend containers and starts PostgreSQL.*

3.  **Access App**:
    - **Frontend**: http://localhost:8080
    - **API**: http://localhost:5000/health

4.  **Verify**:
    - Check terminal logs for `Server running on port 5000`.
    - Go to `/register` to create an account.




# personalized-healthcare-dashboard
