# 25 User Stories (For GitHub Projects)

Copy and paste these as individual Issues in your GitHub Repository. Tag them with labels like `frontend`, `backend`, `security`.

## Authentication & Security
1. **As a User**, I want to register with my email and password so that I can create a private account.
2. **As a User**, I must set up Multi-Factor Authentication (MFA) upon first login to secure my health data.
3. **As a User**, I want to log out securely so that no one else can access my session.
4. **As a User**, I want my session to expire automatically after 15 minutes of inactivity for security.
5. **As an Admin**, I want all user passwords to be hashed with Argon2 to prevent leaks.
6. **As a Developer**, I want to ensure all API communications are over HTTPS to encrypt data in transit.

## Dashboard & Vitals
7. **As a Patient**, I want to log my blood pressure readings (systolic/diastolic) to track hypertension.
8. **As a Patient**, I want to see a line chart of my blood pressure over the last 30 days.
9. **As a Patient**, I want to allow logging of my weight to track BMI changes.
10. **As a Patient**, I want to delete an incorrect health log entry.
11. **As a User**, I want to see the date and time associated with each health log.

## Medications
12. **As a Patient**, I want to add a new medication to my profile (Name, Dosage, Frequency).
13. **As a Patient**, I want to view a list of all my active medications.
14. **As a Patient**, I want to mark a medication as "discontinued" without deleting the history.
15. **As a Caregiver**, I want to see if the patient has taken their medication today.

## Reminders & Notifications
16. **As a User**, I want to set a daily reminder at 8:00 AM to take my pills.
17. **As a User**, I want to receive an email notification for my appointment reminders.
18. **As a User**, I want to snooze a reminder for 10 minutes.

## Profile & Settings
19. **As a User**, I want to update my emergency contact information.
20. **As a User**, I want to change my password.
21. **As a Use**, I want to export my health data as a CSV file to share with my doctor.

## Compliance (Non-functional)
22. **As a Compliance Officer**, I want to ensure all sensitive fields (like diagnosis) are encrypted at rest in the database.
23. **As a Auditor**, I want to see a log of who accessed a specific patient record.
24. **As a Developer**, I want the CI pipeline to run vulnerability scans on every push.
25. **As a Developer**, I want to containerize the application to ensure consistent deployment environments.
