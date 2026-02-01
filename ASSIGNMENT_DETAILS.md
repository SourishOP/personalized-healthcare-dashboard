# 3. MoSCoW Prioritization

| Priority | Feature | Description |
| :--- | :--- | :--- |
| **Must Have** | User Auth + MFA | Critical security requirement. |
| **Must Have** | Vitals Logging | Core value proposition. |
| **Must Have** | Data Encryption | HIPAA compliance requirement. |
| **Should Have** | Medication List | Important for target users (elderly). |
| **Should Have** | Interactive Charts | Better UX for data visualization. |
| **Could Have** | Google Fit Sync | Nice integration but not critical for MVP. |
| **Could Have** | Export to PDF | Useful for doctor visits. |
| **Won't Have** | AI Diagnosis | Out of scope / liability risk. |

---

# 4. Architecture Diagram

Use the code below in **Mermaid Live Editor** or include directly if your markdown viewer supports it.
Alternatively, use this as a reference to draw in **Draw.io**.

\`\`\`mermaid
graph TD
    subgraph Client Application
        User[User] -->|HTTPS / Port 8080| Nginx[Nginx Web Server]
        Nginx -->|Serve Static| Vue[Vue.js Frontend]
        Vue -->|API Requests| Nginx
    end

    subgraph Docker Container Host
        Nginx -->|Reverse Proxy /api| API[Node.js Backend API]
        
        subgraph Security Layer
            API -->|Verify| JWT[JWT Auth Service]
            API -->|Validate| MFA[Speakeasy MFA]
        end

        API -->|Read/Write| DB[(PostgreSQL Database)]
    end

    subgraph Data Layer
        DB -->|Row Level Security| RLS[RLS Policies]
        DB -->|Encryption| PGP[pgcrypto Encrypted Fields]
    end

    User -->|CI/CD Push| GitHub[GitHub Repo]
    GitHub -->|Action| Trivy[Security Scanner]
\`\`\`

## Figma Wireframe Request (6 Screens)
*To fulfill the assignment, create these 6 frames in Figma:*
1.  **Login Screen**: Email, Password, "Login" button.
2.  **MFA Screen**: Input field for 6-digit code, "Verify" button.
3.  **Registration Screen**: Email, Password, Role selection.
4.  **Dashboard Home**: Welcome text, "Add Log" button, "Recent Vitals" list.
5.  **Add Vital Modal**: Dropdown for type (BP/Weight), input field, "Save".
6.  **Chart View**: A simple line graph showing BP trends over time.
