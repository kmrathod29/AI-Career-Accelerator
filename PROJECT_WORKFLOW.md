# AI Career Accelerator — Technical Architecture & Complete Workflow Documentation

> **Document Type:** Production Architecture, System Design & End-to-End Workflow Specification  
> **Target Audience:** Core Developers, Contributors, Engineering Leads, and Onboarding Engineers  
> **Source Verification:** Directly analyzed and traced from the production codebase (`backend/` and `frontend/`)  
> **Codebase State:** Production-ready ATS Analyzer, MongoDB Session Authentication, Account Management, Real-time Notification Engine, and Serverless Deployment on Vercel.

---

## Table of Contents

1. [Executive Summary & Current Implementation Status](#1-executive-summary--current-implementation-status)
2. [Project Architecture Overview](#2-project-architecture-overview)
3. [Complete Frontend Workflow](#3-complete-frontend-workflow)
4. [Button-by-Button / User-Action Execution Trace](#4-button-by-button--user-action-execution-trace)
5. [Authentication & Session Lifecycle](#5-authentication--session-lifecycle)
6. [Database Schema & Data Persistence Model](#6-database-schema--data-persistence-model)
7. [Resume Upload & ATS Analyzer Pipeline](#7-resume-upload--ats-analyzer-pipeline)
8. [ATS Analysis Engine & Data Processing](#8-ats-analysis-engine--data-processing)
9. [ATS Analysis Route Architecture & State Isolation](#9-ats-analysis-route-architecture--state-isolation)
10. [ATS Issues & Verification Engine](#10-ats-issues--verification-engine)
11. [AI Suggestions & Dismissal Lifecycle](#11-ai-suggestions--dismissal-lifecycle)
12. [In-Place Resume Re-Analysis Workflow](#12-in-place-resume-re-analysis-workflow)
13. [Profile Image & Avatar Processing Engine](#13-profile-image--avatar-processing-engine)
14. [Other AI Modules & Feature Flag Status](#14-other-ai-modules--feature-flag-status)
15. [Complete API Reference Specification](#15-complete-api-reference-specification)
16. [Route Mapping: Frontend vs Backend](#16-route-mapping-frontend-vs-backend)
17. [Frontend State Management & Custom Store Engine](#17-frontend-state-management--custom-store-engine)
18. [Dynamic UI Updates & State Reactivity](#18-dynamic-ui-updates--state-reactivity)
19. [File Handling & Storage Architecture](#19-file-handling--storage-architecture)
20. [Error Handling & Resilience Architecture](#20-error-handling--resilience-architecture)
21. [Deployment Architecture (Vercel + Atlas)](#21-deployment-architecture-vercel--atlas)
22. [Environment Variables Specification](#22-environment-variables-specification)
23. [Security, Hardening & Compliance](#23-security-hardening--compliance)
24. [End-to-End User Journeys](#24-end-to-end-user-journeys)
25. [File-by-File Responsibility Directory](#25-file-by-file-responsibility-directory)
26. [Developer Modification Cookbook](#26-developer-modification-cookbook)
27. [Quick Developer Reference & Cheat Sheet](#27-quick-developer-reference--cheat-sheet)

---

## 1. Executive Summary & Current Implementation Status

**AI Career Accelerator** is an AI-powered career optimization platform built with a React SPA frontend and an Express/Node.js backend hosted on Vercel serverless infrastructure with MongoDB Atlas persistence.

### Reality Check: Implemented vs Placeholder Modules

To avoid any confusion for developers joining the project, here is the verified status of every system module:

| Module / Feature | Implementation Status | Implementation Details |
| :--- | :--- | :--- |
| **Authentication** | **Fully Implemented** | Email/password registration, bcrypt hashing (12 rounds), MongoDB-backed `express-session` cookies (`aca.sid`), session persistence via `/api/auth/me`. |
| **Google Sign-In** | **UI Only (Coming Soon)** | Frontend `GoogleButton.jsx` displays a Sonner info toast (`"Coming Soon"`). No OAuth flow or Google backend endpoints exist yet. |
| **Password Recovery** | **UI Only (Coming Soon)** | `ForgotPasswordForm.jsx` and `ResetPasswordForm.jsx` validate schemas and trigger a `"Coming Soon"` toast. In-app password change (`PUT /api/account/password`) is fully implemented. |
| **ATS Analyzer** | **Fully Implemented** | Full PDF/DOCX parsing, dual analysis modes (`resume_only` vs `job_match`), Gemini 3.8 Flash AI evaluation, ATS score calculation, issues list, recommendations, skills breakdown, history, detail routing, and in-place re-analysis. |
| **ATS Issue Verification** | **Fully Implemented** | `"I've Fixed This"` opens a modal, accepts an updated resume, re-analyzes, and computes an automated resolution verdict banner. |
| **AI Suggestion Verification** | **Fully Implemented** | `"I've Applied This"` allows verifying applied AI suggestions against updated resume uploads. Client-side dismissal via `Set` is also implemented. |
| **User Profile & Account** | **Fully Implemented** | Personal info, career profile, social links, base64 avatar upload, password change, active session listing & revocation, JSON account export, and account deletion. |
| **Notification Engine** | **Fully Implemented** | MongoDB `Notification` model, unread badge counters, mark as read/unread, mark all as read, delete, auto-generation on ATS completion and AI generation, optimistic UI updates. |
| **Dashboard** | **Fully Implemented** | Aggregated stats (`GET /api/dashboard`), recent activity feed, unread notification counter, average ATS score, profile completion percentage. |
| **Resume Builder** | **Code Complete / Feature Flagged OFF** | Full builder UI, store, debounced autosave, and backend `/api/resume` endpoints exist, but disabled via `RESUME_BUILDER_ENABLED = false` in `frontend/src/config/features.js`. |
| **Resume Match** | **Placeholder Page** | Renders `PlaceholderPage.jsx` with headline *"Compare your resume against specific job descriptions"*. |
| **Skill Gap Analysis** | **Placeholder Page** | Renders `PlaceholderPage.jsx` with headline *"Identify missing skills for your dream role"*. |
| **Career Roadmap** | **Placeholder Page** | Renders `PlaceholderPage.jsx` with headline *"Visualize your career trajectory"*. |
| **AI Career Coach** | **Placeholder Page** | Renders `PlaceholderPage.jsx` with headline *"Get personalized career guidance"*. |

---

## 2. Project Architecture Overview

```
                                  +-----------------------------+
                                  |         User Browser        |
                                  +--------------+--------------+
                                                 |
                                 HTTPS Requests  |  HttpOnly Session Cookie (aca.sid)
                                 (withCredentials|  JSON Payloads / Multipart Form-Data
                                                 v
                     +-------------------------------------------------------+
                     |         Frontend SPA (Vite + React 19 + Tailwind)     |
                     |         Hosting: Vercel (ai-career-accelerator-bay)   |
                     |  - Custom Stores: atsStore, accountStore, etc.        |
                     |  - UI: Framer Motion, Lucide Icons, Sonner Toasts     |
                     +---------------------------+---------------------------+
                                                 |
                                  REST API Calls | (CORS credentials: true)
                                                 v
                     +-------------------------------------------------------+
                     |         Backend API (Express 4.21 on Node.js)         |
                     |         Hosting: Vercel Serverless Function           |
                     |         Entry: backend/src/server.js                  |
                     +---------------------------+---------------------------+
                                                 |
         +-----------------------+---------------+-----------------------+
         |                       |                                       |
         v                       v                                       v
+-----------------+     +-----------------+                     +-----------------+
|  MongoDB Atlas  |     |  Google Gemini  |                     |  OS Temp Disk   |
|  - users        |     |  3.8 Flash LLM  |                     |  os.tmpdir()    |
|  - atsanalyses  |     |  via official   |                     |  /aca-uploads   |
|  - notifications|     |  @google/genai  |                     |  (Temporary PDF/|
|  - resumes      |     |  Interactions   |                     |   DOCX parsed   |
|  - sessions     |     |  API            |                     |   then unlinked)|
+-----------------+     +-----------------+                     +-----------------+
```

### Core Architecture Components

1. **Frontend Architecture:**
   - Single Page Application (SPA) built on **React 19**, compiled with **Vite 8**, styled with **Tailwind CSS v4** and CSS custom properties (variables for light/dark themes).
   - Client routing via **React Router DOM v7** with layout route nesting (`MainLayout`, `AuthLayout`, `DashboardLayout`).
   - State management relies on React 19's native `useSyncExternalStore` pattern encapsulated in custom store singletons (`atsStore`, `accountStore`, `notificationStore`, `resumeStore`), combined with React Context (`AuthProvider`, `ThemeProvider`).
   - Network layer uses a preconfigured **Axios** instance with `withCredentials: true` and 15-second base timeout (extended to 120 seconds for AI analysis).

2. **Backend Architecture:**
   - **Express 4.21** running as a modern ES module server.
   - Dual-execution design:
     - **Local development:** Runs persistent HTTP listener via `backend/src/local.js` (`node --watch src/server.js` on port 3000).
     - **Production on Vercel:** Exports an asynchronous serverless handler in `backend/src/server.js` with database connection pooling and error wrapping so cold starts never produce `FUNCTION_INVOCATION_FAILED`.
   - Security enforced via `helmet`, strict `cors` validation against allowed origins, and `express-validator` middleware.

3. **Database & Persistence:**
   - **MongoDB** accessed via **Mongoose 8.14**.
   - Session store is backed directly by the `sessions` collection in MongoDB using `connect-mongo 5.1`.
   - Zero in-memory session loss during serverless restarts.

4. **AI Integration:**
   - **Google Gemini 3.8 Flash** (`gemini-3.8-flash`) integrated via the official `@google/genai 2.24.0` SDK using the `Interactions` API (`client.interactions.create`).
   - Includes automatic transient retry logic on HTTP 503 (Service Unavailable).

5. **File Processing:**
   - Multer saves incoming resume uploads to a temporary directory (`os.tmpdir()/aca-uploads`).
   - Extracted in-memory via `pdf-parse` (for PDFs) or `mammoth` (for DOCX).
   - **Crucial Architectural Rule:** The physical resume file is **never stored permanently**. It is unlinked (`fs.unlinkSync`) immediately after text extraction in a `finally` block. Only the structured analysis results are persisted in MongoDB.

---

## 3. Complete Frontend Workflow

### Step-by-Step Navigation & Page States

```
[ Visit / ]
     │
     ├── Not Authenticated ──> Redirect to /auth/login (if accessing /dashboard/*)
     │
     └── Authenticated ──────> Redirect to /dashboard (if accessing /auth/*)
```

#### 1. Landing Page (`/`)
- **Route:** `APP_ROUTES.HOME` (`/`)
- **Component:** `frontend/src/pages/HomePage.jsx` inside `MainLayout.jsx`
- **Data Source:** Static landing hero, feature overview, CTA buttons.
- **Behavior:** Clicking "Get Started" or "Sign In" navigates to `/auth/register` or `/auth/login`. If the user is already authenticated and visits the landing page, clicking "Dashboard" navigates to `/dashboard`.

#### 2. Authentication Pages (`/auth/login`, `/auth/register`)
- **Components:** `LoginPage.jsx` (wrapping `LoginForm.jsx`), `RegisterPage.jsx` (wrapping `RegisterForm.jsx`).
- **Layout:** Wrapped in `RedirectIfAuth` inside `AuthLayout.jsx`. If a valid session exists, immediately navigates to `/dashboard`.
- **Form Handling:** Handled via `react-hook-form` with `zodResolver` against `loginSchema` or `registerSchema`.
- **API Calls:** `POST /api/auth/login` or `POST /api/auth/register`.
- **State Update:** Calls `authContext.login(user)`, triggering store hydration across `accountStore` and `notificationStore`.

#### 3. Protected Dashboard Guard (`/dashboard/*`)
- **Component:** `RequireAuth` in `frontend/src/App.jsx`.
- **Logic:** Reads `{ isAuthenticated, isLoading }` from `useAuth()`.
  - While `isLoading` is true (initial `GET /api/auth/me` request in-flight): Displays `PageLoader.jsx`.
  - If `!isAuthenticated`: Renders `<Navigate to="/auth/login" replace />`.
  - If `isAuthenticated`: Renders `<DashboardLayout />` and requested child route.

#### 4. Dashboard Overview (`/dashboard`)
- **Component:** `DashboardPage.jsx`.
- **Lifecycle:** On mount, triggers `fetchDashboard()` calling `GET /api/dashboard`.
- **Data Displayed:**
  - Dynamic greeting based on current local hour (`Good morning`, `Good afternoon`, `Good evening`).
  - Total ATS Analyses count, latest ATS score, average ATS score across all analyses.
  - Profile completion percentage calculated from all profile/career/social fields.
  - Recent activity feed (chronological list of completed ATS analyses).
  - Quick Action cards navigating to ATS Analyzer, AI Coach, Skill Gap, Roadmap.
- **Loading & Error:** Displays centered `Loader2` spinner during fetch, or an error banner with a `"Try again"` retry button.

#### 5. ATS Analyzer Route (`/dashboard/ats-analyzer`)
- **Component:** `AtsAnalyzerPage.jsx`.
- **Base Route Behavior:** If URL has no `analysisId`, runs `atsStore.resetToEmpty()`. Renders upload onboarding hero (`UploadCardHero.jsx`) and past analysis history list (`AnalysisHistory.jsx`).
- **Detail Route Behavior (`/dashboard/ats-analyzer/:analysisId`):** Automatically triggers `atsStore.loadAnalysis(analysisId)`. Renders two-column analysis dashboard (`ScoreBreakdown`, `KeywordAnalysis`, `AtsIssues`, `AiSuggestions`, `ResumePreviewPanel`, `SkillsCoverage`, `RecruiterChecklist`, `ResumeInsights`, `ImprovementTimeline`).

#### 6. Account & Settings (`/dashboard/account/*`)
- **Component:** `AccountPage.jsx` (lazy-loaded), rendered with nested routes:
  - `/dashboard/account/overview`: Avatar, profile header, completion gauge, stat cards, quick actions.
  - `/dashboard/account/personal`: Name, phone, gender, date of birth, location, bio.
  - `/dashboard/account/career`: Role, experience level, education, university, degree, branch, passing year, skills array, expected salary, employment type.
  - `/dashboard/account/social`: GitHub, LinkedIn, portfolio, LeetCode, Codeforces, HackerRank, website.
  - `/dashboard/account/appearance`: Theme switching (`light`, `dark`, `system`), primary accent colors.
  - `/dashboard/account/notifications`: Email and in-app toggle preferences (stored in `localStorage`).
  - `/dashboard/account/security`: Change password form (`currentPassword`, `newPassword`).
  - `/dashboard/account/privacy`: Profile visibility and search engine indexing preferences (stored in `localStorage`).
  - `/dashboard/account/sessions`: Active sessions list with IP/device parsing and `"Revoke"` action.
  - `/dashboard/account/data`: JSON data export button (`GET /api/account/export`).
  - `/dashboard/account/danger`: Account deletion modal (`DELETE /api/account`).

#### 7. Notifications Center (`/dashboard/notifications`)
- **Component:** `NotificationsPage.jsx`.
- **Data Source:** MongoDB `Notification` collection via `notificationStore.js` and `GET /api/notifications`.
- **Features:** Filter tabs (`All`, `Unread`, `ATS`, `AI`, `System`), mark single read/unread, mark all read, delete single notification, clear all notifications, action link navigation (e.g. `"View Report"` jumps to `/dashboard/ats-analyzer/:id`).

---

## 4. Button-by-Button / User-Action Execution Trace

### 1. "Login" Button (Login Form)
1. **User Action:** Enters email & password, clicks **"Continue"** / **"Sign In"**.
2. **Frontend Validation:** `react-hook-form` validates `loginSchema` (valid email format, non-empty password).
3. **Execution Chain:**
   ```
   LoginForm.jsx (onSubmit)
    -> toast.loading('Signing you in...')
    -> authService.login({ email, password })
    -> Axios: POST /api/auth/login
    -> backend/src/routes/authRoutes.js
    -> validate middleware
    -> backend/src/controllers/authController.js (login)
    -> User.findOne({ email })
    -> bcrypt.compare(password, user.passwordHash)
    -> initializeSession(req, user._id)
    -> connect-mongo writes session to MongoDB 'sessions' collection
    -> Sets 'aca.sid' Set-Cookie header
    -> Returns HTTP 200 { success: true, data: { user: safeUser } }
    -> AuthProvider.jsx (login(user))
    -> accountStore.setFromUser(user)
    -> notificationStore.init()
    -> toast.success('Welcome back!')
    -> navigate('/dashboard', { replace: true })
   ```

### 2. "Create Account" Button (Register Form)
1. **User Action:** Fills first name, last name, email, password, confirms password, checks terms, clicks **"Create Account"**.
2. **Frontend Validation:** Validates `registerSchema` (names 1–50 chars, valid email, password with min 8 chars, 1 uppercase, 1 number, 1 special character, password confirmation match, terms accepted).
3. **Execution Chain:**
   ```
   RegisterForm.jsx (onSubmit)
    -> toast.loading('Creating your account...')
    -> authService.register({ firstName, lastName, email, password })
    -> Axios: POST /api/auth/register
    -> backend/src/routes/authRoutes.js
    -> validate middleware
    -> authController.js (register)
    -> User.findOne({ email }) [Checks for existing email]
    -> bcrypt.hash(password, 12)
    -> User.create({ firstName, lastName, email, passwordHash })
    -> initializeSession(req, user._id)
    -> Writes session to MongoDB
    -> Returns HTTP 201 { success: true, data: { user: safeUser } }
    -> AuthProvider.jsx (login(user))
    -> toast.success('Account created successfully!')
    -> navigate('/dashboard', { replace: true })
   ```

### 3. "Logout" Button (Navbar / Account Menu)
1. **User Action:** Clicks **"Sign out"** in the user dropdown menu.
2. **Execution Chain:**
   ```
   DashboardNavbar.jsx / UserDropdown.jsx
    -> useAuth().logout()
    -> AuthProvider.jsx (logout)
    -> authService.logout()
    -> Axios: POST /api/auth/logout
    -> backend/src/routes/authRoutes.js
    -> requireAuth middleware
    -> authController.js (logout)
    -> req.session.destroy() [Deletes session record from MongoDB]
    -> res.clearCookie('aca.sid')
    -> Returns HTTP 200 { success: true, data: { message: 'Logged out successfully' } }
    -> AuthProvider clears user state to null
    -> accountStore.reset()
    -> notificationStore.reset()
    -> Protected route guard redirects browser to /auth/login
   ```

### 4. "Analyze Resume" / "Upload Resume" Button (ATS Analyzer)
1. **User Action:** User drops or selects a PDF or DOCX file on `UploadCardHero.jsx`, optionally types a Job Description, and clicks **"Analyze Resume"** (or **"Analyze Match"** if JD is provided).
2. **Frontend Validation:** Verifies file exists, format is `.pdf` or `.docx`, size <= 5 MB. If Job Description is typed, checks that length is >= 20 characters and <= 10,000 characters.
3. **Execution Chain:**
   ```
   UploadCardHero.jsx / UploadCardCompact.jsx
    -> atsStore.startAnalysis()
    -> Sets viewMode: 'analyzing', isAnalyzing: true, loadingStep: 0
    -> Starts loading step interval (timer updates UX messages every 2.5s)
    -> atsApi.analyze(rawFile, trimmedJobDescription)
    -> Axios: POST /api/ats/analyze (multipart/form-data, timeout: 120s)
    -> backend/src/routes/atsRoutes.js
    -> requireAuth middleware
    -> multer uploadResume middleware (saves to os.tmpdir()/aca-uploads/)
    -> atsController.js (analyzeResume)
    -> Rate limit check: ATSAnalysis.countDocuments({ userId, createdAt >= 1hr }) < 10
    -> extractText(filePath, mimetype) [via pdf-parse or mammoth]
    -> Evaluates mode: jobDescription >= 20 ? 'job_match' : 'resume_only'
    -> getGeminiClient()
    -> callGemini(client, prompt) [gemini-3.8-flash Interactions API]
    -> extractTextFromInteraction(interaction)
    -> JSON extraction & validateAnalysisResponse(parsed, mode)
    -> ATSAnalysis.create({ userId, resumeFileName, jobDescription, analysisMode, ...validatedResult })
    -> createNotification({ userId, type: 'ats', title: 'ATS analysis completed', ... })
    -> finally: cleanupFile(filePath) [fs.unlinkSync deletes temporary upload]
    -> Returns HTTP 201 { success: true, data: { analysis } }
    -> atsStore updates:
         currentAnalysisId: analysis.id
         currentAnalysis: analysis
         analysesById[analysis.id]: analysis
         viewMode: 'results'
         analysisHistory: [newEntry, ...history]
    -> accountStore.refreshStats()
    -> navigate(`/dashboard/ats-analyzer/${analysis.id}`)
    -> AtsAnalyzerPage renders full report for analysis.id
   ```

### 5. "I've Fixed This" Button (ATS Issue Card)
1. **User Action:** In the **ATS Issues** panel (`AtsIssues.jsx`), user clicks **"I've Fixed This"** on a specific issue.
2. **Execution Chain:**
   ```
   AtsIssues.jsx
    -> setActiveIssue(issue)
    -> Opens ResumeVerificationModal.jsx (mode="issue", targetItem=issue)
    -> Modal displays: "Have you updated your resume to fix this issue?"
    -> User clicks "Upload Updated Resume" and chooses their modified file
    -> ResumeVerificationModal validates file (PDF/DOCX, <= 5 MB)
    -> onConfirmUpload(file)
    -> handleConfirmUpload(file) in AtsIssues.jsx
    -> atsStore.reAnalyzeWithFile(file, currentId, { type: 'issue', id: issue.id, text: issue.text })
    -> Sets viewMode: 'analyzing', customLoadingMessage: 'Analyzing your updated resume...'
    -> atsApi.reAnalyze(analysisId, file, jobDescription)
    -> Axios: POST /api/ats/analyses/:id/re-analyze
    -> backend/src/controllers/atsController.js (reAnalyzeResume)
    -> Re-extracts text from uploaded file
    -> Runs Gemini analysis
    -> Updates existing ATSAnalysis document in MongoDB in-place (keeps same _id)
    -> cleanupFile(filePath)
    -> Returns HTTP 200 { success: true, data: { analysis: updatedAnalysis } }
    -> atsStore compares new analysis.issues against target issue text & id:
         stillDetected = issues.some(...)
         outcome = { type: 'issue', resolved: !stillDetected, text: issue.text }
    -> Sets verificationOutcome in store
    -> Updates currentAnalysis and cached analysesById
    -> AtsIssues.jsx displays Resolution Status Banner:
         If resolved: Emerald banner "Issue resolved after re-analysis."
         If still detected: Amber banner "This issue is still detected in your resume."
   ```

### 6. "I've Applied This" Button (AI Suggestion Card)
1. **User Action:** In **AI Suggestions** (`AiSuggestions.jsx`), user clicks **"I've Applied This"** on a recommendation.
2. **Execution Chain:**
   ```
   AiSuggestions.jsx
    -> setActiveSuggestion(suggestion)
    -> Opens ResumeVerificationModal.jsx (mode="suggestion", targetItem=suggestion)
    -> User selects modified resume file
    -> atsStore.reAnalyzeWithFile(file, currentId, { type: 'suggestion', id: suggestion.id, ... })
    -> POST /api/ats/analyses/:id/re-analyze
    -> Backend re-evaluates updated resume against AI prompts
    -> MongoDB document updated in place
    -> Frontend checks if suggestion is still present in analysis.suggestions:
         outcome = { type: 'suggestion', resolved: !stillDetected, text: suggestion.replacement }
    -> Sets verificationOutcome in store
    -> AiSuggestions.jsx renders Resolution Status Banner:
         If resolved: Emerald banner "Suggestion addressed after re-analysis."
         If not resolved: Blue banner "This suggestion is still recommended for your resume."
   ```

### 7. "Dismiss" Button (AI Suggestion Card)
1. **User Action:** User clicks **"Dismiss"** (X icon) on an AI suggestion.
2. **Execution Chain:**
   ```
   AiSuggestions.jsx
    -> atsStore.dismissSuggestion(suggestion.id)
    -> Adds suggestion.id to internal Set: state.dismissedSuggestions
    -> Emits store change
    -> useAtsDismissed() updates visible suggestions:
         visible = suggestions.filter(s => !dismissed.has(s.id))
    -> AnimatePresence animates item collapse and updates remaining counter
    -> (Client-side dismissal; persists in memory during the active session)
   ```

### 8. "Re-analyze Resume" Button (Resume Preview Panel)
1. **User Action:** In `ResumePreviewPanel.jsx`, user clicks **"Re-analyze Resume"**.
2. **Execution Chain:**
   ```
   ResumePreviewPanel.jsx
    -> setShowReanalyzeModal(true)
    -> Opens ResumeVerificationModal.jsx (mode="reanalyze")
    -> User selects updated resume document
    -> handleConfirmUpload(newFile)
    -> atsStore.reAnalyzeWithFile(newFile, currentId, { type: 'reanalyze' })
    -> POST /api/ats/analyses/:id/re-analyze
    -> In-place MongoDB document update
    -> State updated, history item updated, fresh score breakdown & suggestions rendered
   ```

### 9. "Delete" Button (Analysis History Item)
1. **User Action:** In `AnalysisHistory.jsx`, user clicks the Trash icon on a past analysis.
2. **Execution Chain:**
   ```
   AnalysisHistory.jsx
    -> atsStore.deleteAnalysis(analysisId)
    -> atsApi.deleteAnalysis(analysisId)
    -> Axios: DELETE /api/ats/analyses/:id
    -> backend/src/routes/atsRoutes.js
    -> atsController.js (deleteAnalysis)
    -> ATSAnalysis.findOneAndDelete({ _id: id, userId: req.user._id })
    -> Returns HTTP 200 { success: true, data: { message: 'Analysis deleted' } }
    -> atsStore filters remaining history:
         state.analysisHistory = state.analysisHistory.filter(a => a.id !== analysisId)
         delete state.analysesById[analysisId]
    -> If the deleted analysis was currently active:
         atsStore.resetToEmpty() -> Navigates/renders clean upload onboarding state
    -> accountStore.refreshStats() [Updates ATS counter on profile & dashboard]
    -> Recent Analyses list immediately reflects removal without page reload
   ```

### 10. "Upload Avatar" / Camera Icon Button (Profile Header)
1. **User Action:** User clicks camera icon or **"Upload Avatar"** in `AccountPage.jsx` / `ProfileHeader.jsx`.
2. **Execution Chain:**
   ```
   AccountPage.jsx (handleAvatarUpload)
    -> Dynamically creates input[type="file", accept="image/*"]
    -> Triggers browser file dialog
    -> User selects image file
    -> Validates: file.type.startsWith('image/'), file.size <= 2 * 1024 * 1024 (2 MB)
    -> FileReader.readAsDataURL(file)
    -> On load: dataUrl = reader.result (base64 string)
    -> accountStore.saveAvatar(dataUrl)
    -> Optimistically updates local profile.profile.avatar
    -> accountService.updateAvatar(dataUrl)
    -> Axios: PATCH /api/account/avatar { avatar: dataUrl }
    -> backend/src/routes/accountRoutes.js
    -> validate middleware (avatar string <= 2,000,000 characters)
    -> accountController.js (updateAvatar)
    -> user.profile.avatar = avatar
    -> user.save() in MongoDB
    -> Returns HTTP 200 { success: true, data: { user } }
    -> accountStore merges fresh user document
    -> Avatar immediately updates in ProfileHeader, DashboardNavbar, and account overview
   ```

### 11. "Save Profile" / "Save Career" / "Save Social" Buttons
1. **User Action:** User fills personal, career, or social form fields in Account settings and clicks **"Save Changes"**.
2. **Execution Chain:**
   ```
   PersonalInfoForm.jsx / CareerForm.jsx / SocialLinksForm.jsx
    -> accountStore.saveProfile(formData) / saveCareer(data) / saveSocial(data)
    -> Sets isSaving: true
    -> accountService.updateProfile / updateCareer / updateSocial
    -> Axios: PATCH /api/account/profile (or /career or /social)
    -> backend/src/routes/accountRoutes.js (whitelist validation)
    -> accountController.js updates specific sub-schema fields
    -> user.save() in MongoDB
    -> Returns HTTP 200 { success: true, data: { user } }
    -> accountStore updates profile, sets isSaving: false, hasUnsavedChanges: false
    -> Form shows checkmark success state
   ```

### 12. "Revoke Session" Button (Sessions Card)
1. **User Action:** User navigates to `/dashboard/account/sessions` and clicks **"Revoke"** on an active device.
2. **Execution Chain:**
   ```
   SessionsCard.jsx
    -> accountService.revokeSession(sessionKey)
    -> Axios: DELETE /api/account/sessions/:sessionKey
    -> backend/src/routes/accountRoutes.js
    -> sessionController.js (revokeSession)
    -> sessionService.js (findActiveUserSession & revokeUserSession)
    -> Destroys target session in connect-mongo store
    -> If the revoked session was the CURRENT session:
         res.clearCookie('aca.sid')
         Frontend redirects to /auth/login
    -> If an OTHER session:
         Returns HTTP 200 { success: true, data: { currentSessionRevoked: false } }
         SessionsCard removes device row from active list
   ```

### 13. "Export Data" Button (Data Export Card)
1. **User Action:** User clicks **"Download JSON Export"** in `/dashboard/account/data`.
2. **Execution Chain:**
   ```
   DataExportCard.jsx
    -> accountService.exportData()
    -> Axios: GET /api/account/export
    -> backend/src/routes/accountRoutes.js
    -> accountController.js (exportData)
    -> Aggregates user profile, career, and socialLinks via user.toSafeObject()
    -> Returns HTTP 200 { exportedAt, format, account }
    -> Browser creates Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    -> Triggers file download: ai-career-accelerator-account-export.json
   ```

### 14. "Delete Account" Button (Danger Zone Card)
1. **User Action:** In `/dashboard/account/danger`, user types confirmation phrase and clicks **"Delete My Account"**.
2. **Execution Chain:**
   ```
   DangerZoneCard.jsx
    -> accountService.deleteAccount()
    -> Axios: DELETE /api/account
    -> backend/src/routes/accountRoutes.js
    -> accountController.js (deleteAccount)
    -> User.findByIdAndDelete(req.user._id)
    -> req.session.destroy()
    -> res.clearCookie('aca.sid')
    -> Returns HTTP 200 { message: 'Account deleted successfully' }
    -> AuthProvider resets state
    -> Window redirects to /
   ```

### 15. Notification Actions (Mark Read, Read All, Clear All)
1. **Mark Single as Read:** Clicking unread indicator or row calls `notificationStore.markAsRead(id)`. Optimistically marks item read, decrements unread count, then calls `PATCH /api/notifications/:id/read`.
2. **Mark All as Read:** Clicking **"Mark all as read"** calls `notificationStore.markAllAsRead()`. Optimistically marks all items read, sets `unreadCount: 0`, calls `PATCH /api/notifications/read-all`.
3. **Delete Single Notification:** Clicking delete icon calls `notificationStore.deleteNotification(id)`. Optimistically removes from array, calls `DELETE /api/notifications/:id`.
4. **Clear All Notifications:** Clicking **"Clear all"** calls `notificationStore.clearAll()`. Empties list and calls `DELETE /api/notifications`.

---

## 5. Authentication & Session Lifecycle

### Architecture: Stateful Server Sessions over MongoDB

```
+---------------------------------------------------------------------------------+
|                                 LOGIN FLOW                                      |
|                                                                                 |
| 1. POST /api/auth/login  ──> Express ──> bcrypt.compare() ──> Valid?           |
|                                                                    │ Yes        |
| 2. req.session.userId = user._id                                  v            |
| 3. connect-mongo creates document in 'sessions' collection                       |
| 4. Express sends Set-Cookie: aca.sid=s%3A...; HttpOnly; Secure; SameSite=None;  |
+---------------------------------------------------------------------------------+
                                      │
                                      ▼
+---------------------------------------------------------------------------------+
|                               PAGE REFRESH / ME                                 |
|                                                                                 |
| 1. Browser loads React SPA                                                      |
| 2. AuthProvider runs useEffect()                                                |
| 3. GET /api/auth/me (Cookie aca.sid sent automatically via withCredentials: true)|
| 4. requireAuth middleware:                                                      |
|      - Reads req.session.userId                                                 |
|      - Finds User in MongoDB (excluding passwordHash)                           |
|      - Attaches user to req.user                                                |
| 5. Returns { success: true, data: { user: safeUser } }                          |
| 6. React state: setUser(user) -> isAuthenticated = true                         |
+---------------------------------------------------------------------------------+
```

### Detailed Lifecycle Properties

1. **Session Cookie Configuration (`backend/src/config/session.js`):**
   - **Cookie Name:** `aca.sid`
   - **Lifespan (maxAge):** 7 days (`7 * 24 * 60 * 60 * 1000` ms)
   - **httpOnly:** `true` (Inaccessible to browser JavaScript; completely immune to XSS token theft).
   - **secure:** `true` in production (Transmitted strictly over HTTPS).
   - **sameSite:** `'none'` in production (Required for cross-origin communication between the Vercel frontend domain and Vercel backend API domain); `'lax'` in local development.
   - **path:** `'/'`
   - **resave:** `false`
   - **saveUninitialized:** `false`

2. **Database Storage (`connect-mongo`):**
   - Sessions are persisted in the `sessions` collection in MongoDB Atlas.
   - When the serverless backend scales down or cold-starts on a new instance, the session is read directly from MongoDB. The user is **never prematurely logged out** due to serverless instance recycling.
   - `touchAfter: 24 * 3600`: Session updates are debounced by 24 hours unless session data changes.

3. **Multi-Session Opaque Hashing (`backend/src/services/sessionService.js`):**
   - When a user views their active sessions on `/dashboard/account/sessions`, the raw MongoDB session IDs and cookies are **never sent to the client**.
   - The backend hashes the session ID with HMAC-SHA256 using `SESSION_SECRET`:
     ```javascript
     function getPublicSessionKey(sessionId) {
       return createHmac('sha256', secret).update(sessionId).digest('hex')
     }
     ```
   - This public key is used as the URL parameter for `DELETE /api/account/sessions/:sessionKey`, allowing safe session revocation without exposing session credentials.

4. **Page Refresh Resilience:**
   - On every browser refresh, `AuthProvider` initializes with `isLoading: true`.
   - `RequireAuth` holds navigation in suspense by rendering `PageLoader`.
   - Once `GET /api/auth/me` resolves, `isLoading` turns `false`, and the user is rendered directly on their requested route with zero UI flicker.

---

## 6. Database Schema & Data Persistence Model

The application uses **MongoDB** managed via **Mongoose**. Below are all active models, collections, and fields.

```
                              +--------------------+
                              |     User Model     |
                              |  collection: users |
                              +---------+----------+
                                        |
               +------------------------+------------------------+
               | 1:N                    | 1:N                    | 1:1
               v                        v                        v
    +----------------------+  +---------------------+  +--------------------+
    |  ATSAnalysis Model   |  | Notification Model  |  |    Resume Model    |
    | collection:          |  | collection:         |  | collection:        |
    | atsanalyses          |  | notifications       |  | resumes            |
    +----------------------+  +---------------------+  +--------------------+
```

### 1. `User` Model (`backend/src/models/User.js`)
- **Collection Name:** `users`
- **Purpose:** Primary user identity, personal bio, career background, and social links.

| Field Name | Type | Constraints / Defaults | Purpose |
| :--- | :--- | :--- | :--- |
| `firstName` | `String` | Required, trimmed, max 50 | User's first name |
| `lastName` | `String` | Required, trimmed, max 50 | User's last name |
| `email` | `String` | Required, unique, lowercased, max 254 | Primary login email |
| `passwordHash` | `String` | Required | Bcrypt hash (rounds = 12). Stripped in `toSafeObject()` and `toJSON` |
| **`profile`** | `Subdocument` | Default: `{}` | Personal information sub-schema |
| `profile.phone` | `String` | Trimmed, max 20, default `''` | Phone contact |
| `profile.gender` | `String` | Trimmed, max 20, default `''` | Gender identity |
| `profile.dateOfBirth` | `String` | Trimmed, default `''` | Birth date string |
| `profile.country` | `String` | Trimmed, max 100, default `''` | Country of residence |
| `profile.city` | `String` | Trimmed, max 100, default `''` | City |
| `profile.state` | `String` | Trimmed, max 100, default `''` | State / Region |
| `profile.bio` | `String` | Trimmed, max 500, default `''` | Personal biography |
| `profile.avatar` | `String` | Default `''` | **Base64 Data URL string** of profile photo |
| **`career`** | `Subdocument` | Default: `{}` | Career preferences & background |
| `career.currentRole` | `String` | Trimmed, max 100 | Current professional job title |
| `career.experienceLevel` | `String` | Trimmed, max 30 | Level (Entry, Mid, Senior, etc.) |
| `career.education` | `String` | Trimmed, max 30 | Highest education attained |
| `career.university` | `String` | Trimmed, max 150 | Institution name |
| `career.degree` | `String` | Trimmed, max 100 | Degree title |
| `career.branch` | `String` | Trimmed, max 100 | Field of study / branch |
| `career.passingYear` | `String` | Trimmed, max 10 | Year of graduation |
| `career.skills` | `[String]` | Max 30 items, each max 50 chars | User's tagged technical skills |
| `career.preferredRole` | `String` | Trimmed, max 100 | Desired future job title |
| `career.preferredLocation`| `String` | Trimmed, max 100 | Desired work location |
| `career.expectedSalary`| `String` | Trimmed, max 50 | Salary expectation range |
| `career.employmentType`| `String` | Trimmed, max 30 | Full-time, Remote, Contract, etc. |
| **`socialLinks`** | `Subdocument` | Default: `{}` | External portfolio and coding links |
| `socialLinks.linkedin` | `String` | Max 300, valid URL or `''` | LinkedIn profile URL |
| `socialLinks.github` | `String` | Max 300, valid URL or `''` | GitHub profile URL |
| `socialLinks.portfolio`| `String` | Max 300, valid URL or `''` | Personal portfolio URL |
| `socialLinks.leetcode` | `String` | Max 300, valid URL or `''` | LeetCode profile URL |
| `socialLinks.codeforces`| `String` | Max 300, valid URL or `''`| Codeforces profile URL |
| `socialLinks.hackerrank`| `String` | Max 300, valid URL or `''`| HackerRank profile URL |
| `socialLinks.website` | `String` | Max 300, valid URL or `''` | Generic personal website URL |
| `createdAt` / `updatedAt`| `Date` | Mongoose Timestamps | Record creation / update dates |

### 2. `ATSAnalysis` Model (`backend/src/models/ATSAnalysis.js`)
- **Collection Name:** `atsanalyses`
- **Purpose:** Full persistent record of an ATS resume audit.
- **Indexes:** `{ userId: 1, createdAt: -1 }` (Optimized for user's chronological history queries).

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `userId` | `ObjectId (ref: 'User')` | Owner user ID (Required, Indexed) |
| `resumeFileName` | `String` | Original name of uploaded resume file (e.g. `"John_Doe_Resume.pdf"`) |
| `jobDescription` | `String` | Optional job description text (max 10,000 chars) |
| `analysisMode` | `String ('resume_only' \| 'job_match')` | Operating mode used for analysis |
| `overallScore` | `Number (0–100)` | Aggregate ATS compatibility score |
| `scoreBreakdown` | `Array<{ id, label, score, icon, explanation }>` | Sectional scoring breakdown |
| `matchedKeywords` | `[String]` | Keywords detected in resume |
| `missingKeywords` | `[String]` | Keywords present in JD but absent in resume (strictly empty in `resume_only`) |
| `suggestedKeywords`| `[String]` | Complementary industry keywords suggested by AI |
| `issues` | `Array<{ id, text, severity: 'high'\|'medium'\|'low' }>` | Actionable parsing/content defects |
| `suggestions` | `Array<{ id, original, replacement, context }>` | Precise phrasing replacements |
| `compatibility` | `{ compatible: Number, needsImprovement: Number, critical: Number }` | Category status breakdown |
| `skillsCoverage` | `Array<{ name, current: Number, recommended: Number }>` | Detected technical competencies and strengths |
| `checklist` | `Array<{ id, label, passed: Boolean }>` | Recruiter ATS parsing checklist |
| `insights` | `Object` | Readability metrics: `wordCount`, `pageCount`, `readingTime`, `avgSentenceLength`, `keywordDensity`, `passiveVoice`, `numbersUsed`, `actionVerbs` |
| `timeline` | `Array<{ id, label, priority, status }>` | Strategic step-by-step improvement roadmap |
| `summary` | `String` | Executive summary of resume assessment |
| `status` | `String ('completed' \| 'failed')` | Processing outcome status |
| `createdAt` / `updatedAt`| `Date` | Mongoose Timestamps |

### 3. `Notification` Model (`backend/src/models/Notification.js`)
- **Collection Name:** `notifications`
- **Purpose:** In-app user notifications for background events, analysis completions, and system alerts.
- **Indexes:** `{ userId: 1, createdAt: -1 }`, `{ userId: 1, read: 1 }`

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `userId` | `ObjectId (ref: 'User')` | Target user ID (Required, Indexed) |
| `type` | `String (enum)` | `['success', 'error', 'warning', 'info', 'ai', 'job', 'resume', 'interview', 'ats', 'career_roadmap', 'subscription', 'system']` |
| `title` | `String` | Required, trimmed, max 200 |
| `description` | `String` | Trimmed, max 500 |
| `read` | `Boolean` | Read state (default: `false`) |
| `actionUrl` | `String` | In-app route to open on click (e.g. `/dashboard/ats-analyzer/67...`) |
| `actionLabel` | `String` | Button label (e.g. `"View Report"`) |
| `metadata` | `Mixed` | Arbitrary JSON metadata (e.g. `{ analysisId }`) |
| `createdAt` / `updatedAt`| `Date` | Mongoose Timestamps (transformed to `timestamp` ms epoch in `toJSON`) |

### 4. `Resume` Model (`backend/src/models/Resume.js`)
- **Collection Name:** `resumes`
- **Purpose:** Stores user-created interactive resumes for the Resume Builder module.
- **Unique Constraint:** `{ userId: 1 }` (One interactive builder resume document per user).
- **Sub-schemas:** `experiences`, `education`, `projects`, `certifications`, `achievements`, `languages`, `customSections`, `personalInfo`, `socialLinks`, `sectionOrder`, `activeTemplate`, and cached `aiSuggestions`.

---

## 7. Resume Upload & ATS Analyzer Pipeline

### Complete Flow: File Selection to UI Rendering

```
[ User selects PDF/DOCX ]
          │
          ▼
[ Frontend Validation ]
  - Extension: .pdf, .docx
  - Size: <= 5 MB
          │
          ▼
[ Axios: POST /api/ats/analyze ] (multipart/form-data)
          │
          ▼
[ Multer: Storage Engine ]
  - Writes to os.tmpdir()/aca-uploads/
  - Generates unique temporary filename
          │
          ▼
[ Text Extraction ]
  - PDF:  pdf-parse (PDFParse class instance)
  - DOCX: mammoth (extractRawText)
  - Checks if text length >= 50 characters
          │
          ▼
[ Gemini 3.8 Flash AI Analysis ]
  - Builds prompt based on mode:
      * With JD (>= 20 chars) -> buildJobMatchPrompt
      * Without JD            -> buildResumeOnlyPrompt
  - Calls Interactions API (with 503 retry handler)
  - Extracts and parses JSON output
  - validateAnalysisResponse() checks and sanitizes all fields
          │
          ▼
[ Database Persistence ]
  - ATSAnalysis.create() saves full structured report to MongoDB
  - createNotification() writes notification to MongoDB
          │
          ▼
[ Finally: Cleanup ]
  - cleanupFile() runs fs.unlinkSync(filePath)
  - File is deleted from server disk permanently
          │
          ▼
[ Response & Routing ]
  - Returns HTTP 201 { success: true, data: { analysis } }
  - atsStore updates in-memory cache and history
  - Browser navigates to /dashboard/ats-analyzer/:id
```

### Physical File Storage Reality: Where Does the PDF Go?

1. **The PDF is NOT permanently stored:**
   - Neither on the server filesystem, nor in MongoDB as binary (GridFS), nor in AWS S3, nor in Cloudinary.
2. **Temporary Existence:**
   - Multer's `diskStorage` temporarily streams the file to `path.join(os.tmpdir(), 'aca-uploads', uniqueFilename)`.
   - On Vercel, this temporary path lives in the execution environment's ephemeral `/tmp` directory.
3. **Disposal:**
   - The file is deleted inside the `finally` block of `analyzeResume` and `reAnalyzeResume` via `cleanupFile()`:
     ```javascript
     function cleanupFile(filePath) {
       try {
         if (filePath && fs.existsSync(filePath)) {
           fs.unlinkSync(filePath)
         }
       } catch { /* noop */ }
     }
     ```
   - The file ceases to exist on disk milliseconds after text extraction completes.
4. **Why Past Analyses Can Be Viewed Without the PDF:**
   - The system stores all analytical findings (`scoreBreakdown`, `matchedKeywords`, `issues`, `insights`, `skillsCoverage`, `resumeFileName`, etc.) in the `ATSAnalysis` MongoDB collection.
   - The UI does not display an embedded PDF viewer; it renders the **audit report** of the resume.
5. **Why Re-Analysis Requires Another Upload:**
   - Because the original file was destroyed immediately after parsing, a re-analysis cannot simply "re-read" the previous PDF. The user must provide their updated file.

---

## 8. ATS Analysis Engine & Data Processing

The ATS Analyzer operates in two distinct modes depending on whether a target Job Description was provided:

### 1. `resume_only` Mode (Standalone Audit)
- **Condition:** No Job Description provided, or JD < 20 characters.
- **Rules Enforced in AI Prompt & Controller:**
  - Evaluates format, readability, section completeness, action verbs, and grammar.
  - **`missingKeywords` is strictly forced to `[]`:** Because no job was targeted, the system never invents missing keywords or penalizes the user for lacking skills they never claimed to target.
  - **`skillsCoverage` lists ONLY verified detected skills:** Non-existent categories (e.g. 0% Database) are stripped.

### 2. `job_match` Mode (Targeted Role Alignment)
- **Condition:** Job Description provided (>= 20 characters).
- **Rules Enforced in AI Prompt & Controller:**
  - Evaluates candidate experience and skills against the specific requirements in the JD.
  - Generates `matchedKeywords` vs `missingKeywords` directly from the JD text.
  - Phrased objectively (e.g. *"Not detected in your resume"* rather than *"Candidate lacks ability"*).

### Data Mapping: UI Components to Database Fields

```
+-----------------------------------------------------------------------------------+
| ATS ANALYZER REPORT DASHBOARD (/dashboard/ats-analyzer/:id)                       |
|                                                                                   |
| [LEFT COLUMN: 7 Cols]                          [RIGHT COLUMN: 5 Cols]             |
|                                                                                   |
| 1. CompatibilityMeter.jsx                      1. AtsScoreHero.jsx                |
|    Source: analysis.compatibility                 Source: analysis.overallScore   |
|                                                                                   |
| 2. ScoreBreakdown.jsx                          2. ResumePreviewPanel.jsx          |
|    Source: analysis.scoreBreakdown                Source: analysis.resumeFileName |
|                                                   Action: Re-analyze Resume       |
| 3. KeywordAnalysis.jsx                                                            |
|    Source: analysis.matchedKeywords,           3. AiSuggestions.jsx               |
|            analysis.missingKeywords,              Source: analysis.suggestions    |
|            analysis.suggestedKeywords             Action: I've Applied This       |
|                                                                                   |
| 4. AtsIssues.jsx                               4. SkillsCoverage.jsx              |
|    Source: analysis.issues                        Source: analysis.skillsCoverage |
|    Action: I've Fixed This                                                        |
|                                                5. RecruiterChecklist.jsx          |
| 5. ResumeInsights.jsx                             Source: analysis.checklist      |
|    Source: analysis.insights                                                      |
|                                                                                   |
| 6. ImprovementTimeline.jsx                                                        |
|    Source: analysis.timeline                                                      |
|                                                                                   |
| 7. AnalysisHistory.jsx                                                            |
|    Source: atsStore.analysisHistory                                               |
+-----------------------------------------------------------------------------------+
```

---

## 9. ATS Analysis Route Architecture & State Isolation

### Route Structure

- **Base Route:** `/dashboard/ats-analyzer`
- **Detail Route:** `/dashboard/ats-analyzer/:analysisId`

### Isolation & History Synchronization

To ensure that opening one analysis never shows residual or conflicting data from another resume:

1. **State Isolation (`atsStore.js`):**
   - The store maintains an in-memory dictionary `analysesById: { [id]: analysisObject }` alongside `currentAnalysisId` and `currentAnalysis`.
2. **URL Parameter Sync (`AtsAnalyzerPage.jsx`):**
   ```javascript
   useEffect(() => {
     if (analysisId) {
       atsStore.loadAnalysis(analysisId)
     } else {
       // On base route /dashboard/ats-analyzer, clean state
       atsStore.resetToEmpty()
     }
   }, [analysisId])
   ```
3. **Cache-First Loading with Network Fallback:**
   - If `analysisId` is already cached in `analysesById[analysisId]`, it renders instantly.
   - If not cached (e.g. direct page refresh, bookmarked link, or new session), it sets `viewMode: 'analyzing'` and calls `GET /api/ats/analyses/:id`.
   - Once fetched, it populates `analysesById` and renders the matching report.
4. **Invalid / 404 Analysis Handling:**
   - If a user enters an invalid or non-existent ID, the backend returns HTTP 404 `{ success: false, message: 'Analysis not found' }`.
   - `atsStore` transitions to `viewMode: 'error'`.
   - `AtsAnalyzerPage` displays `AtsErrorState.jsx` with an error message and a `"Return to Analyzer"` button navigating back to `/dashboard/ats-analyzer`.

---

## 10. ATS Issues & Verification Engine

### How ATS Issues Work

1. **Detection:** During LLM processing, formatting errors, unquantified bullets, or missing sections are identified and categorized into `high`, `medium`, or `low` severity.
2. **Display:** `AtsIssues.jsx` lists detected issues with severity tags.
3. **The "Fix" Action:**
   - Clicking **"I've Fixed This"** does **NOT** automatically modify the resume file (the server cannot alter the user's local document).
   - Instead, it opens `ResumeVerificationModal.jsx`, instructing the user to edit their resume locally and upload the revised file.
4. **Automated Verification:**
   - The frontend calls `atsStore.reAnalyzeWithFile(file, analysisId, { type: 'issue', id: issue.id, text: issue.text })`.
   - The backend runs a complete re-analysis on the newly uploaded file and updates the MongoDB document in place.
   - The frontend inspects the freshly generated `issues` array:
     ```javascript
     const stillDetected = analysis.issues?.some((iss) => {
       const issText = (iss.text || '').toLowerCase().trim()
       return (
         (target.id && iss.id === target.id) ||
         issText === targetText ||
         (targetText.length > 15 && issText.includes(targetText.slice(0, 30)))
       )
     })
     ```
   - If `stillDetected` is `false`: `outcome.resolved = true`. A green banner announces: *"Issue resolved after re-analysis."*
   - If `stillDetected` is `true`: `outcome.resolved = false`. An amber banner warns: *"This issue is still detected in your resume."*

---

## 11. AI Suggestions & Dismissal Lifecycle

### Generation & Structure
- Suggestions are generated during Gemini analysis with structured JSON:
  - `original`: Weak phrasing or bullet point in the resume (can be `null` if it is a general recommendation).
  - `replacement`: AI-optimized high-impact phrasing.
  - `context`: Strategic rationale.

### Actions Available
1. **"I've Applied This":**
   - User applies the wording to their resume document locally and uploads the updated file via `ResumeVerificationModal`.
   - Backend performs in-place re-analysis.
   - Frontend verifies if the suggestion has been addressed and displays a resolution banner.
2. **"Dismiss":**
   - User clicks **"Dismiss"** (X icon).
   - Handled immediately on the client via `atsStore.dismissSuggestion(id)`.
   - The suggestion ID is added to a `Set` (`state.dismissedSuggestions`), causing the item to animate out and decrementing the visible suggestion counter.

---

## 12. In-Place Resume Re-Analysis Workflow

When an existing analysis is re-analyzed (via `POST /api/ats/analyses/:id/re-analyze`):

1. **Requires New File:** Because previous files are deleted immediately, the user must upload an updated file.
2. **ID Preservation:** The backend updates the **existing** MongoDB document using `ATSAnalysis.findOne({ _id: id, userId: req.user._id })`. It does **not** create a new document.
3. **Route Stability:** The user stays on the exact same URL: `/dashboard/ats-analyzer/:id`.
4. **Atomic Replacement:** All fields (`overallScore`, `scoreBreakdown`, `issues`, `suggestions`, `insights`, `checklist`, `timeline`) are replaced with the fresh evaluation.
5. **Notification:** A notification is created: *"ATS analysis updated — Your updated resume scored X/100."*
6. **Failure Recovery:** If re-analysis fails (e.g. invalid file or AI timeout), the existing analysis data remains untouched in MongoDB.

---

## 13. Profile Image & Avatar Processing Engine

```
[ User selects image file ]
             │
             ▼
[ Client Validation ]
  - Must start with image/
  - Size <= 2 MB (2 * 1024 * 1024 bytes)
             │
             ▼
[ Browser FileReader ]
  - reader.readAsDataURL(file)
  - Produces Base64 string: "data:image/jpeg;base64,/9j/4AAQSk..."
             │
             ▼
[ Axios: PATCH /api/account/avatar ]
  - Body: { avatar: dataUrl }
             │
             ▼
[ Backend Validation ]
  - express-validator: body('avatar').isString().isLength({ max: 2_000_000 })
             │
             ▼
[ MongoDB Update ]
  - user.profile.avatar = avatar
  - user.save()
             │
             ▼
[ Instant Multi-Component Re-render ]
  - accountStore merges updated user
  - ProfileHeader, DashboardNavbar, and Account Overview reflect new avatar
```

### Storage Reality
- The avatar is **NOT** stored in AWS S3 or external cloud buckets.
- It is stored directly in MongoDB on the `User` document as a string inside `user.profile.avatar`.
- On login and page refresh, `GET /api/auth/me` returns `user.profile.avatar`, which React renders via standard `<img src={avatar} />`.

---

## 14. Other AI Modules & Feature Flag Status

### 1. Resume Builder (`/dashboard/resume-builder`)
- **Status:** **Code Complete, Feature-Flagged OFF**.
- **Location of Flag:** `frontend/src/config/features.js`:
  ```javascript
  export const RESUME_BUILDER_ENABLED = false
  ```
- **Behavior:** Visiting `/dashboard/resume-builder` automatically redirects to `/dashboard`. When enabled, activates the full interactive resume editor, drag-and-drop section ordering, debounced autosave (`PUT /api/resume`), and Gemini AI suggestion caching (`POST /api/resume/ai-suggestions`).

### 2. Resume Match, Skill Gap, Career Roadmap, AI Coach
- **Status:** **Frontend Placeholders (`PlaceholderPage.jsx`)**.
- **Routes:**
  - `/dashboard/resume-match` -> `ResumeMatchPage.jsx`
  - `/dashboard/skill-gap` -> `SkillGapPage.jsx`
  - `/dashboard/career-roadmap` -> `CareerRoadmapPage.jsx`
  - `/dashboard/ai-coach` -> `AiCoachPage.jsx`
- **Backend:** No dedicated backend routes exist yet for these four modules. (Note: Job description comparison is supported within the ATS Analyzer via `analysisMode: 'job_match'`).

---

## 15. Complete API Reference Specification

All endpoints are prefixed with `/api`. Authenticated endpoints require the `aca.sid` session cookie sent automatically via `credentials: 'include'` / `withCredentials: true`.

### Authentication (`/api/auth`)

| Method | Endpoint | Auth Required | Request Body / Params | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | `{ firstName, lastName, email, password }` | `{ user }` (201) | Create new account & establish session |
| `POST` | `/api/auth/login` | No | `{ email, password }` | `{ user }` (200) | Authenticate & establish session |
| `POST` | `/api/auth/logout` | **Yes** | None | `{ message }` (200) | Destroy session & clear cookie |
| `GET` | `/api/auth/me` | **Yes** | None | `{ user }` (200) | Restore user session on app launch |

### Account & Profile (`/api/account`)

| Method | Endpoint | Auth Required | Request Body / Params | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/account/profile` | **Yes** | None | `{ user, stats }` | Fetch complete profile and activity stats |
| `PATCH`| `/api/account/profile` | **Yes** | `{ firstName, lastName, phone, bio, city, state, country, ... }` | `{ user }` | Update personal profile information |
| `PATCH`| `/api/account/career` | **Yes** | `{ currentRole, experienceLevel, skills, preferredRole, ... }` | `{ user }` | Update career preferences and skills |
| `PATCH`| `/api/account/social` | **Yes** | `{ linkedin, github, portfolio, leetcode, ... }` | `{ user }` | Update professional social URLs |
| `PATCH`| `/api/account/avatar` | **Yes** | `{ avatar }` (Base64 string <= 2MB) | `{ user }` | Update user profile image |
| `PUT` | `/api/account/password`| **Yes** | `{ currentPassword, newPassword }` | `{ message }` | Change user password |
| `GET` | `/api/account/sessions`| **Yes** | None | `{ sessions: Array }` | List active sessions (device, IP, time) |
| `DELETE`| `/api/account/sessions/:key`| **Yes**| Param: `sessionKey` (64-char hex) | `{ currentSessionRevoked: Boolean }` | Revoke a specific active session |
| `GET` | `/api/account/export` | **Yes** | None | `{ exportedAt, format, account }` | Export account data as JSON |
| `DELETE`| `/api/account` | **Yes** | None | `{ message }` | Permanently delete account and sessions |

### ATS Analyzer (`/api/ats`)

| Method | Endpoint | Auth Required | Request Type & Body | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/api/ats/analyze` | **Yes** | `multipart/form-data`: `resume` (file), `jobDescription` (text) | `{ analysis }` (201) | Upload and execute ATS analysis |
| `POST` | `/api/ats/analyses/:id/re-analyze` | **Yes** | Param: `id`, `multipart/form-data`: `resume`, `jobDescription` | `{ analysis }` (200) | In-place re-analysis of existing record |
| `GET` | `/api/ats/analyses` | **Yes** | Query: `?page=1&limit=10` | `{ analyses, pagination }` | Fetch user's analysis history |
| `GET` | `/api/ats/analyses/:id` | **Yes** | Param: `id` (ObjectId) | `{ analysis }` (200) | Fetch specific analysis by ID |
| `DELETE`| `/api/ats/analyses/:id`| **Yes** | Param: `id` (ObjectId) | `{ message }` (200) | Delete an analysis record |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Auth Required | Request Params | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | **Yes** | None | `{ user, stats, recentActivity, recentAnalyses, notifications, unreadNotificationCount }` | Aggregated dashboard homepage data |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth Required | Request Body / Params | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/notifications` | **Yes** | Query: `?page=1&limit=20` | `{ notifications, pagination, unreadCount }` | Get notifications list |
| `GET` | `/api/notifications/unread-count` | **Yes** | None | `{ unreadCount }` | Lightweight unread counter |
| `PATCH`| `/api/notifications/:id/read` | **Yes** | Param: `id` | `{ notification }` | Mark notification as read |
| `PATCH`| `/api/notifications/:id/unread`| **Yes** | Param: `id` | `{ notification }` | Mark notification as unread |
| `PATCH`| `/api/notifications/read-all` | **Yes** | None | `{ modifiedCount, unreadCount }` | Mark all notifications as read |
| `DELETE`| `/api/notifications/:id` | **Yes** | Param: `id` | `{ message }` | Delete a single notification |
| `DELETE`| `/api/notifications` | **Yes** | None | `{ deletedCount, message }` | Clear all notifications |

### Health Check (`/api/health`)

| Method | Endpoint | Auth Required | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/health` | No | `{ server: 'up', database: 'up' }` (200) or 503 if DB down | Infrastructure & uptime monitoring |

### Resume Builder (`/api/resume` — Feature Flagged)

| Method | Endpoint | Auth Required | Request Body | Response Data | Purpose |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `GET` | `/api/resume` | **Yes** | None | `{ resume }` | Load interactive builder resume |
| `PUT` | `/api/resume` | **Yes** | Full resume JSON document | `{ resume }` | Upsert builder resume (autosave) |
| `DELETE`| `/api/resume` | **Yes** | None | `{ message }` | Delete interactive resume |
| `POST` | `/api/resume/ai-suggestions` | **Yes** | `{ targetRole }` | `{ suggestions, cached }` | Gemini suggestions for builder resume |

---

## 16. Route Mapping: Frontend vs Backend

### Frontend Routes (`frontend/src/App.jsx`)

| Route Path | Component | Protection | Layout | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| `/` | `HomePage` | Public | `MainLayout` | Marketing landing page |
| `/auth/login` | `LoginPage` | Redirect if Auth | `AuthLayout` | User login |
| `/auth/register` | `RegisterPage` | Redirect if Auth | `AuthLayout` | User registration |
| `/auth/forgot-password`| `ForgotPasswordPage`| Redirect if Auth | `AuthLayout` | Password recovery (UI only) |
| `/auth/reset-password` | `ResetPasswordPage` | Redirect if Auth | `AuthLayout` | Password reset (UI only) |
| `/dashboard` | `DashboardPage` | **RequireAuth** | `DashboardLayout` | Main dashboard overview |
| `/dashboard/ats-analyzer` | `AtsAnalyzerPage` | **RequireAuth** | `DashboardLayout` | ATS upload & history landing |
| `/dashboard/ats-analyzer/:analysisId` | `AtsAnalyzerPage` | **RequireAuth** | `DashboardLayout` | Specific ATS report view |
| `/dashboard/resume-builder` | `ResumeBuilderPage` | **RequireAuth** | `DashboardLayout` | Builder (Redirects if disabled) |
| `/dashboard/resume-match` | `ResumeMatchPage` | **RequireAuth** | `DashboardLayout` | Resume match placeholder |
| `/dashboard/skill-gap` | `SkillGapPage` | **RequireAuth** | `DashboardLayout` | Skill gap placeholder |
| `/dashboard/career-roadmap`| `CareerRoadmapPage` | **RequireAuth** | `DashboardLayout` | Roadmap placeholder |
| `/dashboard/ai-coach` | `AiCoachPage` | **RequireAuth** | `DashboardLayout` | Career coach placeholder |
| `/dashboard/notifications` | `NotificationsPage` | **RequireAuth** | `DashboardLayout` | Notifications center |
| `/dashboard/account/*` | `AccountPage` | **RequireAuth** | `DashboardLayout` | Account & profile sub-sections |
| `*` | `NotFoundPage` | Public | None | 404 page |

---

## 17. Frontend State Management & Custom Store Engine

The frontend avoids heavyweight state libraries (Redux/Zustand) in favor of **React 19's native `useSyncExternalStore` architecture**. Each domain has a dedicated singleton store that manages state, subscriptions, and async API synchronization:

### 1. `atsStore.js`
- Manages: `currentAnalysisId`, `currentAnalysis`, `analysesById` (cache), `rawFile`, `uploadedFile`, `jobDescription`, `isAnalyzing`, `loadingStep`, `verificationOutcome`, `viewMode`, `analysisHistory`, `dismissedSuggestions`.
- Methods: `init()`, `uploadFile()`, `removeFile()`, `setJobDescription()`, `startAnalysis()`, `loadAnalysis(id)`, `reAnalyzeWithFile()`, `deleteAnalysis(id)`, `dismissSuggestion(id)`, `resetToEmpty()`.

### 2. `accountStore.js`
- Manages: `profile` (personal, career, social), `stats` (analyses count), `notificationPrefs`, `privacyPrefs`, `appearancePrefs`, `isLoading`, `isSaving`, `hasUnsavedChanges`.
- Methods: `init()`, `refreshStats()`, `setFromUser()`, `saveProfile()`, `saveCareer()`, `saveSocial()`, `saveAvatar(dataUrl)`, `changePassword()`.

### 3. `notificationStore.js`
- Manages: `notifications` list, `unreadCount`, `isLoading`, `popupDismissedIds`.
- Methods: `init()`, `fetchUnreadCount()`, `markAsRead(id)`, `markAsUnread(id)`, `markAllAsRead()`, `deleteNotification(id)`, `clearAll()`.
- Supports **optimistic updates**: instantly updates the UI badge counter and state before the network call finishes.

### 4. `AuthProvider.jsx` (Context)
- Manages session lifecycle (`user`, `isAuthenticated`, `isLoading`, `login`, `logout`).
- Coordinates hydration of `accountStore` and `notificationStore` on login/session check.

---

## 18. Dynamic UI Updates & State Reactivity

All user modifications update the interface dynamically without requiring manual page reloads:

| User Action | Persistence Layer | Frontend State Update | Visual Result in UI |
| :--- | :--- | :--- | :--- |
| **Upload & Analyze Resume** | MongoDB `atsanalyses` | `atsStore.analysesById`, `analysisHistory` updated | Navigates to `/ats-analyzer/:id`; displays animated score gauge and report |
| **Verify Fixed Issue** | Updated existing MongoDB record | `verificationOutcome` set; `currentAnalysis` updated | Green/Amber resolution banner appears; issue list refreshes |
| **Dismiss AI Suggestion** | In-memory `Set` in `atsStore` | Visible array filtered | Suggestion collapses with smooth layout transition; count decrements |
| **Delete Analysis** | Deleted from MongoDB | Filtered from `analysisHistory` and `analysesById` | Card vanishes from history; if active, returns to clean upload view |
| **Upload Avatar** | MongoDB `users.profile.avatar` | `accountStore.profile.avatar` updated | Header, Navbar, and UserDropdown avatars update immediately |
| **Update Career Skills** | MongoDB `users.career.skills` | `accountStore.profile.career` updated | Skill tags update; profile completion bar recalculates |
| **Mark Notification Read** | MongoDB `notifications.read` | Optimistic update in `notificationStore` | Bell badge count decrements instantly; item styling shifts to read |

---

## 19. File Handling & Storage Architecture

### Supported File Formats & Validation Rules

```
                      +-----------------------------+
                      |         File Upload         |
                      +--------------+--------------+
                                     |
               +---------------------+---------------------+
               |                                           |
               v                                           v
     [ Resume Document ]                          [ Profile Avatar ]
     - Extensions: .pdf, .docx                    - Types: image/*
     - Max Size: 5 MB                             - Max Size: 2 MB
     - Pipeline: Multer Disk                      - Pipeline: FileReader
     - Destination: os.tmpdir()                   - Format: Base64 String
     - Extraction: pdf-parse / mammoth            - Destination: MongoDB
     - Lifecycle: fs.unlinkSync() (Destroyed)     - Lifecycle: Permanent
```

### Resume Document File Lifecycle
1. **Frontend Validation:** `UploadCard.jsx` and `ResumeVerificationModal.jsx` reject files exceeding 5 MB (`5 * 1024 * 1024` bytes) or with extensions other than `.pdf` and `.docx`.
2. **Backend Validation:** Multer `fileFilter` verifies MIME types:
   - `application/pdf`
   - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
3. **Extraction:**
   - PDF: Parsed using `pdf-parse` (`PDFParse.getText()`).
   - DOCX: Parsed using `mammoth` (`mammoth.extractRawText()`).
   - Rejects corrupted or image-only documents with text length < 50 characters with HTTP 422.
4. **Cleanup:** In the `finally` block of the controller, `cleanupFile(filePath)` invokes `fs.unlinkSync()`. The file is destroyed immediately.

---

## 20. Error Handling & Resilience Architecture

The system handles errors at all stages to prevent server crashes and provide actionable user feedback:

### 1. Gemini AI Resilience & Retries (`backend/src/controllers/atsController.js`)
- **Transient 503 Retries:** If Gemini returns HTTP 503 (Service Unavailable / high load), the controller automatically pauses for 1000ms and retries once before surfacing an error.
- **Quota Exceeded (429):** Returns user-friendly message: *"AI request limit reached. Please wait a minute before trying again."*
- **Model Unavailable (503):** Catches missing keys or model deprecations: *"AI analysis service is temporarily misconfigured or unavailable."*
- **JSON Parsing Errors:** If Gemini returns markdown-wrapped or malformed text, regex `{[\s\S]*\}` extracts the raw JSON. If extraction fails, returns HTTP 502 with clean guidance.

### 2. File Upload & Extraction Errors
- **File Too Large:** Multer `LIMIT_FILE_SIZE` returns HTTP 413: *"File size must be under 5 MB"*.
- **Unsupported Type:** Returns HTTP 400: *"Only PDF and DOCX files are supported"*.
- **Unreadable / Image PDF:** Returns HTTP 422: *"Could not extract sufficient text from the resume. The file may be image-based or empty."*

### 3. Frontend Error Boundaries & Toast Feedback
- **Toast Notifications:** Handled by **Sonner** (`toast.error()`, `toast.success()`, `toast.loading()`, `toast.info()`).
- **Section Error Boundary (`AccountSectionErrorBoundary`):** If an account section crashes, it falls back to an error card with a *"Go to Overview"* recovery button without crashing the dashboard.
- **ATS Error State (`AtsErrorState.jsx`):** Renders friendly recovery screen on invalid analysis IDs.

---

## 21. Deployment Architecture (Vercel + Atlas)

### Production Setup

- **Frontend:** Hosted on Vercel (`https://ai-career-accelerator-bay.vercel.app`).
  - Config: `frontend/vercel.json` rewrites all requests to `/index.html` for client-side routing.
- **Backend:** Hosted on Vercel as a Serverless Function (`https://backend-kappa-seven-14.vercel.app`).
  - Config: `backend/vercel.json` routes `/api/(.*)` to `/src/server.js`.
- **Database:** Hosted on MongoDB Atlas.

### Vercel Serverless Optimization (`backend/src/server.js`)
- Express normally runs via `app.listen(port)`. On Vercel, calling `app.listen()` causes timeouts.
- `server.js` detects execution environment:
  - If `!process.env.VERCEL && process.argv.includes('server.js')`: Loads `backend/src/local.js` and starts persistent HTTP server.
  - If on Vercel: Exports `async function handler(req, res)` wrapping `connectDB()` and `app(req, res)`.
- **Mongoose Connection Caching:** `connectDB()` caches the connection promise in memory across cold starts.

---

## 22. Environment Variables Specification

| Variable Name | Description | Environment | Required | Default / Example Value |
| :--- | :--- | :---: | :---: | :--- |
| `PORT` | Local Express listening port | Backend | No | `3000` |
| `NODE_ENV` | Runtime environment mode | Backend | Yes | `development` / `production` |
| `MONGODB_URI` | MongoDB connection string | Backend | **Yes** | `mongodb+srv://<user>:<password>@cluster.mongodb.net/aca` |
| `SESSION_SECRET`| Cryptographic key for session cookies | Backend | **Yes** | 64-character random hex string |
| `CORS_ORIGIN` | Allowed frontend origin (no trailing slash) | Backend | **Yes** | `https://ai-career-accelerator-bay.vercel.app` |
| `GEMINI_API_KEY`| Google Gemini API key | Backend | **Yes** | `AIzaSy...` |
| `VERCEL` | Injected by Vercel serverless platform | Backend | Auto | `1` (when running on Vercel) |
| `VITE_API_URL` | Base backend API endpoint URL | Frontend | **Yes** | `https://backend-kappa-seven-14.vercel.app/api` |

*(Never commit actual secrets or `.env` files to git repositories).*

---

## 23. Security, Hardening & Compliance

1. **Authentication Security:**
   - Passwords hashed with `bcrypt` using 12 salt rounds.
   - User enumeration protected: Login endpoint returns generic *"Invalid email or password"*.
   - Password hashes permanently stripped in `User.toSafeObject()` and `toJSON()`.
2. **Session Hardening:**
   - Stored in MongoDB, signed with `SESSION_SECRET`.
   - `httpOnly: true` completely blocks JavaScript access (`document.cookie` cannot read `aca.sid`).
   - Multi-session management exposes only HMAC-SHA256 hashed public tokens.
3. **HTTP & API Security:**
   - `helmet` sets HTTP security headers (cross-origin resource policy, frameguard, XSS protection).
   - Strict CORS origin whitelisting with allowed methods and headers.
   - Body parser payload limits: `1mb` limit for JSON/urlencoded data (prevents memory exhaustion DOS).
   - Rate limiting: Max 10 ATS analyses per hour per user.
4. **Input Sanitization:**
   - `express-validator` on all mutation routes.
   - Whitelist updating in controllers (`pick(req.body, ALLOWED_FIELDS)`) prevents mass-assignment vulnerabilities.

---

## 24. End-to-End User Journeys

### Journey 1: New User Signup -> Resume Analysis -> Issue Resolution
1. User visits landing page `/`, clicks **"Get Started"**, navigates to `/auth/register`.
2. Fills registration form -> Account created in MongoDB -> Session initialized -> Redirected to `/dashboard`.
3. Welcome card shows 0 analyses and prompting to run an audit. User clicks **"Analyze ATS"**.
4. Opens `/dashboard/ats-analyzer`. Uploads `Resume.pdf`, leaves Job Description blank (activates `resume_only` mode).
5. Clicks **"Analyze Resume"**. UI transitions to animated loader.
6. Multer saves temp file -> `pdf-parse` extracts text -> File unlinked -> Gemini 3.8 Flash audits resume -> Analysis saved to MongoDB.
7. System navigates to `/dashboard/ats-analyzer/:id`. Score hero shows 74/100.
8. User inspects **ATS Issues** card: detects *"Missing quantified metrics in experience bullet points"* (High severity).
9. User clicks **"I've Fixed This"**. Modal opens. User edits resume on local machine, adds metric percentages, and uploads revised PDF into the modal.
10. System calls re-analyze endpoint -> In-place document update -> Compares issues -> Green banner appears: *"Issue resolved after re-analysis."* Score increases to 82/100.
11. User navigates back to `/dashboard`: Total analyses now shows 1, Latest ATS Score shows 82/100, Average shows 82%.

---

## 25. File-by-File Responsibility Directory

### Backend (`backend/src/`)

| File Path | Core Responsibility |
| :--- | :--- |
| `server.js` | Universal serverless export for Vercel + CLI startup routing. |
| `local.js` | Persistent local HTTP listener on `PORT`. |
| `app.js` | Express app initialization, CORS, Helmet, body parsers, routes, error handlers. |
| `config/db.js` | MongoDB connection manager with cold-start promise caching. |
| `config/session.js` | Express-session configuration with `connect-mongo` store. |
| `config/gemini.js` | Lazy singleton initialization for Google Gemini API client. |
| `models/User.js` | User schema (profile, career, social, passwordHash). |
| `models/ATSAnalysis.js` | Full ATS analysis schema, sub-schemas, and indexes. |
| `models/Notification.js` | In-app notification schema and type enums. |
| `models/Resume.js` | Interactive Resume Builder schema (feature-flagged). |
| `controllers/authController.js` | Register, login, logout, me. |
| `controllers/atsController.js` | Multer upload, text extraction, Gemini prompt execution, analysis CRUD, in-place re-analysis. |
| `controllers/accountController.js`| Profile updates, base64 avatar save, password change, data export, account deletion. |
| `controllers/sessionController.js`| Active sessions listing and opaque token revocation. |
| `controllers/dashboardController.js`| Aggregated metrics, recent activity, and profile completion calculations. |
| `controllers/notificationController.js`| Notification retrieval, marking read/unread, and deletion. |
| `services/sessionService.js` | Connect-mongo session document parsing, device identification, HMAC public key hashing. |
| `services/notificationService.js` | System-wide utility to create in-app notifications. |
| `middleware/auth.js` | `requireAuth` session validation middleware. |
| `middleware/validate.js` | Express-validator validation runner. |
| `utils/apiResponse.js` | Standardized `sendSuccess()` and `sendError()` helpers. |

### Frontend (`frontend/src/`)

| File Path | Core Responsibility |
| :--- | :--- |
| `App.jsx` | Top-level routing, route guards (`RequireAuth`, `RedirectIfAuth`), layout wrapping. |
| `config/features.js` | Application feature flags (e.g. `RESUME_BUILDER_ENABLED`). |
| `constants/routes.js` | Application route path constants and helper functions. |
| `providers/AuthProvider.jsx` | Session authentication state and store hydration coordinator. |
| `services/api.js` | Configured Axios client with `withCredentials: true`. |
| `services/atsApi.js` | Network calls for ATS analyze, re-analyze, history, detail, delete. |
| `services/accountService.js` | Network calls for profile, career, avatar, password, sessions, export. |
| `services/authService.js` | Network calls for register, login, logout, me. |
| `services/dashboardApi.js` | Network call for aggregated dashboard data. |
| `services/notificationApi.js` | Network calls for notifications CRUD. |
| `stores/atsStore.js` | `useSyncExternalStore` for ATS state, cache, upload, analysis, re-analysis, verification. |
| `stores/accountStore.js` | `useSyncExternalStore` for profile, career, avatar, and settings. |
| `stores/notificationStore.js` | `useSyncExternalStore` for notification list and unread count with optimistic updates. |
| `pages/DashboardPage.jsx` | Main dashboard view with stats, recent activity, quick actions. |
| `pages/dashboard/AtsAnalyzerPage.jsx`| ATS landing and detail dashboard page. |
| `pages/dashboard/AccountPage.jsx` | Tabbed account management and settings renderer. |
| `pages/dashboard/NotificationsPage.jsx`| Notification inbox with filtering and batch actions. |
| `components/ats-analyzer/ResumeVerificationModal.jsx`| Modal for verifying fixed issues, applied suggestions, and re-analysis. |
| `components/ats-analyzer/AtsIssues.jsx` | ATS issues list with severity tags and verification workflow. |
| `components/ats-analyzer/AiSuggestions.jsx` | AI suggestions with replacement diffs and dismissal. |
| `components/ats-analyzer/UploadCard.jsx` | Hero and compact drag-and-drop resume upload cards. |
| `components/account/ProfileHeader.jsx` | Profile banner, avatar display, and avatar upload trigger. |

---

## 26. Developer Modification Cookbook

### How do I...

#### 1. Modify the ATS Scoring Criteria or Prompts?
- **Backend File:** `backend/src/controllers/atsController.js`
- **Functions:** `buildResumeOnlyPrompt()` and `buildJobMatchPrompt()`
- **Instructions:** Modify prompt guidelines or JSON response schema. Remember to update `validateAnalysisResponse()` to validate any new fields.

#### 2. Re-enable the Resume Builder?
- **Frontend File:** `frontend/src/config/features.js`
- **Change:** Set `export const RESUME_BUILDER_ENABLED = true`
- **Result:** The route `/dashboard/resume-builder` will become active, sidebar links will appear, and resume builder stat cards will render.

#### 3. Implement Google OAuth?
- **Frontend File:** `frontend/src/components/auth/GoogleButton.jsx`
  - Replace `toast.info('Coming Soon')` with Google Identity Services SDK or redirect to `/api/auth/google`.
- **Backend File:** Add passport or Google OAuth verify token middleware in `backend/src/routes/authRoutes.js` and `backend/src/controllers/authController.js`. Establish session via `initializeSession(req, user._id)`.

#### 4. Switch from Base64 Avatars to Cloud Storage (AWS S3 / Cloudinary)?
- **Backend File:** `backend/src/routes/accountRoutes.js` and `backend/src/controllers/accountController.js`
- **Change:** Replace `body('avatar')` JSON string handling with a Multer middleware to upload the image to S3/Cloudinary, and store the resulting HTTPS image URL in `user.profile.avatar`.

#### 5. Add a New Dashboard Quick Action?
- **Frontend File:** `frontend/src/pages/DashboardPage.jsx`
- **Change:** Add an object to `ALL_QUICK_ACTIONS` with `label`, `icon`, `path`, and `color`.

---

## 27. Quick Developer Reference & Cheat Sheet

### Running the Project Locally

```bash
# 1. Backend Setup
cd backend
npm install
# Ensure .env has MONGODB_URI, SESSION_SECRET, GEMINI_API_KEY, CORS_ORIGIN=http://localhost:5173
npm run dev      # Runs node --watch src/server.js on http://localhost:3000

# 2. Frontend Setup
cd ../frontend
npm install
# Ensure .env.development has VITE_API_URL=http://localhost:3000/api
npm run dev      # Runs Vite dev server on http://localhost:5173
```

### Key Architectural Truths to Remember
- **Session Authentication:** Never use JWT tokens in localStorage. The system uses secure `aca.sid` cookies with MongoDB session storage.
- **Resume File Lifecycle:** PDFs are parsed in memory / temp disk and **immediately deleted**. The database stores the structured analysis, not the raw binary file.
- **Re-Analysis:** Updates the **existing** analysis in place; does not generate a new analysis ID.
- **ATS Isolation:** Always pass `analysisId` via `/dashboard/ats-analyzer/:analysisId`. Base route `/dashboard/ats-analyzer` is reserved for new uploads and history.
- **State Store Subscriptions:** Always use custom selector hooks (e.g. `useAtsResult()`, `useProfile()`) to prevent unnecessary component re-renders.

---
*Documentation maintained by AI Career Accelerator Core Architecture Team.*
