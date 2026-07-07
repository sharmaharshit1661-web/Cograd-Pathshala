# Cograd Pathshala - Complete System Documentation & Production Guide

This document provides a comprehensive guide to the architecture, database models, role-based features, backend API integrations, simulated components, and the step-by-step roadmap required to make the Cograd Pathshala website live for production users.

---

## 1. Architectural & Technology Stack Overview

Cograd Pathshala is structured as a decoupled full-stack web application:

*   **Frontend**: 
    *   **Core**: React (built using [Vite](https://vite.dev/)), JSX, ES6+ modules.
    *   **Styling**: Vanilla CSS alongside [Tailwind CSS](https://tailwindcss.com/) for fluid layouts.
    *   **Client Routing**: `react-router-dom` handles navigation.
    *   **Assets & Icons**: `lucide-react` for premium icons and UI elements.
    *   **Smooth Scroll**: Powered by `Lenis` via a custom React Hook ([useSmoothScroll.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/hooks/useSmoothScroll.js)).
*   **Backend**:
    *   **Core**: Node.js with the [Express](https://expressjs.com/) framework.
    *   **Database**: MongoDB database instance mapped via [Mongoose ODM](https://mongoosejs.com/).
    *   **Authentication**: JSON Web Tokens (`jsonwebtoken`) for secure session management and `bcryptjs` for hashing passwords.
    *   **File Storage**: `multer` paired with `multer-storage-cloudinary` to directly upload verified tutor credentials to [Cloudinary](https://cloudinary.com/) storage.
    *   **Email System**: [Resend API](https://resend.com/) for transactional emails (account verification and credential dispatch).

---

## 2. Database Schemas & Models

The MongoDB database contains eight primary collections defined in Mongoose schemas:

### A. User Schema ([User.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/User.js))
Acts as a unified collection for all user roles: `student`, `teacher`, and `parent`.
*   **Core Fields**: `id` (custom unique string), `name`, `email` (unique, lowercase), `password` (hashed), `phone`, `role` (enum: `'student'`, `'teacher'`, `'parent'`), `isEmailVerified` (boolean), `avatar`, `joinDate`.
*   **Student Fields**: `standard` (grade level), `subjects` (array), `test_score` (object containing scores), `test_completed_at`, `assigned_teacher_id`, `status` (e.g. `'pending_test'`, `'pending_match'`, `'matched'`, `'active'`), `city`, `district`, `locality`, `attendance` (attendance percentage string), `attendance_log` (array of marked daily records), `syllabus_chapters` (progress tracking list), `study_goals` (target checklist), `video_notes` (saved video bookmarks), `xp` (experience points), `unlocked_rewards` (gamified badges), `earned_certificates` (completed milestones), `teacher_doubts` (chat logs of doubts raised), `feeDue`, `feeDueDate`, `feeStatus` (`'Paid'` / `'Unpaid'`).
*   **Teacher Fields**: `qualifications`, `experience`, `bio`, `subjects_taught` (array), `grade_levels_qualified` (array), `verification_status` (enum: `'Pending'`, `'Verified'`), `current_student_count`, `max_student_capacity`, `teaching_style` (enum: `'beginner'`, `'intermediate'`, `'advanced'`), `hourly_rate` (default `₹500/hr`), `rating` (default `5.0`), `documents` (array storing Cloudinary URLs, public IDs, and document types), `free_slots` (available tuition timings), `timetable` (scheduled batches).
*   **Parent Fields**: `relationship` (`'Mother'` / `'Father'` / `'Guardian'`), `childName`, `childStandard`, `childSubjects` (array), `childCity`, `childLocality`, `linkedChildId` (stores the child's student `id`).

### B. Assignment Schema ([Assignment.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/Assignment.js))
Tracks student-teacher tutor matching states.
*   **Fields**: `id`, `student_id`, `teacher_id`, `assigned_by` (admin ID), `assigned_at`, `status` (enum: `'proposed'`, `'confirmed'`, `'active'`, `'ended'`, `'needs_review'`), `needs_review` (boolean), `review_reason`.

### C. Demo Booking Schema ([DemoBooking.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/DemoBooking.js))
Stores lead records and tutor bookings submitted from the landing page.
*   **Fields**: `id` (prefixed `DEMO-`), `studentName`, `parentPhone`, `studentClass`, `subjects` (array), `preferredDate`, `preferredTime`, `preferredDays` (array), `district`, `villageArea`, `landmark`, `assigned_teacher_id` (auto-selected tutor), `status` (enum: `'pending_admin_confirmation'`, `'pending_teacher_acceptance'`, `'confirmed'`, `'declined'`).

### D. Support Ticket Schema ([SupportTicket.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/SupportTicket.js))
Tracks tickets raised by users inside their dashboards.
*   **Fields**: `id` (prefixed `TCK-`), `userId`, `userName`, `userRole`, `title`, `description`, `category` (e.g. `'General Support'`, `'Billing'`), `status` (enum: `'Pending'`, `'Resolved'`).

### E. Payment Schema ([Payment.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/Payment.js))
Records manual and simulated transaction histories.
*   **Fields**: `id` (prefixed `PAY-`), `studentId`, `studentName`, `amount`, `method` (`'Card'` / `'UPI'` / `'Cash / Manual'`), `status` (default `'Paid'`), `date` (YYYY-MM-DD), `recordedBy`.

### F. Announcement Schema ([Announcement.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/Announcement.js))
Stores notice board broadcasts sent by the admin.
*   **Fields**: `id`, `title`, `text`, `target` (e.g., `'All Students & Teachers'`), `priority` (enum: `'Low'`, `'Medium'`, `'High'`), `date`.

### G. Enquiry Schema ([Enquiry.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/Enquiry.js))
Stores general queries collected via the public contact form.
*   **Fields**: `id`, `name`, `course`, `phone`, `email`, `type` (enum: `'New'`, `'Follow-up'`, `'Enrolled'`).

### H. Admin Settings Schema ([AdminSettings.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/models/AdminSettings.js))
Stores configuration configurations editable by admin roles.
*   **Fields**: `key` (default `'main'`), `centreName`, `contactEmail`, `contactPhone`, `address`, `session`, `currency`, `autoReminders` (boolean), `emailAlerts` (boolean), `whatsappSync` (boolean).

---

## 3. Core Features & Frontend-Backend Integration

Here is a detailed breakdown of Cograd Pathshala's front-facing screens, back-facing connections, and the mechanisms driving them.

### A. Authentication & Onboarding
*   **Sign In / Log In ([Login.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/Login.jsx))**:
    *   **How it Works**: User selects a role and inputs email and password. Upon successful validation, the backend generates a JWT token stored in the browser's `localStorage` as `cograd_token`.
    *   **Backend Connection**: `POST /api/auth/login`
        *   *Payload*: `{ email, password, role }`
        *   *Response*: `{ token, id, name, email, role, isEmailVerified }`
*   **Google OAuth Single Sign-On**:
    *   **How it Works**: Integrates the official Sign-in with Google SDK. If the user does not exist in the database, they are redirected to complete role selection and profile registration.
    *   **Backend Connection**: `POST /api/auth/google-login`
        *   *Payload*: `{ token: google_credential_token }`
*   **Email Verification Flow ([VerifyEmail.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/VerifyEmail.jsx))**:
    *   **How it Works**: Blocks new signups until they submit a 6-digit code sent to their registered email.
    *   **Backend Connections**:
        *   Verify Code: `POST /api/auth/verify-email` (Payload: `{ email, code }`)
        *   Resend Code: `POST /api/auth/resend-verification` (Payload: `{ email }`)
*   **Teacher Registration & Credentials Upload ([RegisterTeacher.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/RegisterTeacher.jsx))**:
    *   **How it Works**: Multiphase form collecting credentials, slots, and document uploads. Multi-part form request handles raw uploads. 
    *   **Backend Connection**: `POST /api/auth/register` (uses pre-multer middleware in [auth.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/routes/auth.js) to pre-assign a unique ID `req._teacherId` so that uploaded documents land in `/uploads/teacher-docs/teacher_id/` folders, or Cloudinary folder buckets).
        *   *Payload*: `multipart/form-data` containing text inputs + files (`doc_resume`, `doc_degree`, `doc_id_proof`).

### B. Student Dashboard ([StudentDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/StudentDashboard.jsx))
*   **Overview Board (Home)**:
    *   **How it Works**: Fetches user status. Displays assigned tutor profile cards (with contact triggers). Shows upcoming class schedule, attendance levels, and broad announcement panels.
    *   **Backend Connection**: `GET /api/auth/me` (reads assigned tutor fields) and `GET /api/teachers/:teacherId` (gets details of the student's assigned tutor).
*   **My Classes & Timetable**:
    *   **How it Works**: Displays daily schedules and historic attendance charts. Students can inspect dates, check whether they were marked Present/Absent by their tutor, and request cancellations.
    *   **Backend Connection**: Fetches student logs from `GET /api/auth/me`. Updates are stored inside the student user document via `PUT /api/students/:id`.
*   **Study Materials & NCERT / JEE AI Chatbot**:
    *   **How it Works**: Displays uploaded materials. Integrates an interactive chat interface where students ask queries about academic concepts. The AI formats math equations and markdown derivations.
    *   **Backend Connection**: `POST /api/ai/chat`
        *   *Payload*: `{ question: String, history: Array }`
        *   *API Backend Logic*: Proxies the request using Nvidia's high-speed completion API targeting the `google/diffusiongemma-26b-a4b-it` model.
*   **Diagnostic & Academic Tests**:
    *   **How it Works**: Renders interactive testing interfaces. Tracks total correct answers and updates scores in the profile.
    *   **Backend Connection**: `PUT /api/students/:id`
        *   *Payload*: `{ test_score: { Mathematics: Int, Science: Int, total: Int }, status: 'pending_match' }`
*   **Support Desk**:
    *   **How it Works**: Form to submit technical or academic support requests.
    *   **Backend Connection**: `POST /api/support-tickets`
        *   *Payload*: `{ userId, userName, userRole, title, description, category }`

### C. Teacher Dashboard ([TeacherDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/TeacherDashboard.jsx))
*   **My Dashboard & Analytics**:
    *   **How it Works**: Aggregates tutoring statistics: total active students, cumulative hours, hourly revenue sheets, and pending demo requests.
    *   **Backend Connections**: `GET /api/demo-bookings/teacher/:teacherId` and `GET /api/assignments/teacher/:teacherId`.
*   **Mark Attendance & Schedule Classes**:
    *   **How it Works**: Teachers select dates, tick checkboxes for attending students, and submit logs. The backend updates logs on each student document and recalculates their attendance percentages.
    *   **Backend Connection**: `POST /api/attendance`
        *   *Payload*: `{ teacherId, date, records: [{ studentId, present: Boolean }] }`
*   **Homework Assignments**:
    *   **How it Works**: Assigns tasks, downloads student submissions, reviews worksheets, and assigns grades/comments.
    *   **Backend Connection**: Saves task array inside the teacher's profile via `PUT /api/teachers/:id` and updates student profile records via `PUT /api/students/:id`.
*   **Demo Request Management**:
    *   **How it Works**: Shows demo leads routed by the admin matching system. Teachers review timing and location details and accept or reject the demo lesson.
    *   **Backend Connection**: `PUT /api/demo-bookings/:id/status`
        *   *Payload*: `{ status: 'confirmed' | 'declined' }`
*   **Profile, Locality & Pricing Configuration**:
    *   **How it Works**: Allows tutors to configure settings that feed directly into the admin's tutor matchmaker: teaching styles, localities served, hourly rates, and time slots.
    *   **Backend Connection**: `PUT /api/teachers/:id`
        *   *Payload*: `{ free_slots, teaching_style, hourly_rate, locality, travelRange }`

### D. Parent Dashboard ([ParentDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/ParentDashboard.jsx))
*   **Academic Tracker & Daily Learning Logs**:
    *   **How it Works**: Displays children's performance. Reads daily teaching remarks submitted by the tutor (e.g. topic covered, assessment score, progress review).
    *   **Backend Connection**: `GET /api/students/:studentId/daily-reports`.
*   **Fee Manager**:
    *   **How it Works**: Displays total outstanding balance and transaction histories. Allows parents to simulate digital card/UPI payments.
    *   **Backend Connection**: `POST /api/payments` (records details) and `PUT /api/students/${childId}` (clears dues).

### E. Admin Dashboard ([AdminDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/AdminDashboard.jsx))
*   **System Analytics & Overview**:
    *   **How it Works**: Displays overall metrics (active registrations, pending matching queues, verified tutor counts).
    *   **Backend Connection**: Fetches data collections via `GET /api/students`, `GET /api/teachers`, `GET /api/payments`.
*   **Tutor Matchmaking Engine**:
    *   **How it Works**: Helps admins match unmatched students. When an admin selects a student, the matching algorithm ranks verified tutors using a custom scoring matrix:
        1.  **City Match**: Confirms tutors reside in the same city (capitalized string regex check).
        2.  **Verification Status**: Filters out unverified tutors.
        3.  **Active Capacity**: Ignores tutors whose student counts exceed their maximum limit.
        4.  **Subject & Grade Compatibility**: Confirms tutors are qualified for the student's standard and chosen subjects.
        5.  **Score Alignment (Matching Style)**: If the student's diagnostic test score is low (<60%), tutors with a `'beginner'` style are given +10 points. If the student has high marks (>=80%), `'advanced'` style tutors get +10. Otherwise, `'intermediate'` tutors get preference.
        6.  **Locality Proximity (Bonus)**: If tutor and student share the exact same locality/neighborhood, they receive +30 bonus compatibility points.
    *   **Backend Connections**:
        *   Suggested matches: `GET /api/teachers/suggested/:studentId` (or client-side calculation from synced tables).
        *   Tutor Allotment: `POST /api/assignments/allot` (Payload: `{ studentId, teacherId }`). Creates an Assignment with status `'proposed'` and flags the student status to `'matched'`.
*   **Teacher Application Verification Flow**:
    *   **How it Works**: Admins view teacher documentation (resumes, ID cards) in an inline PDF viewer. Clicking "Approve" triggers an email dispatch containing auto-generated credentials.
    *   **Backend Connection**: `PUT /api/teachers/:id`
        *   *Payload*: `{ verification_status: 'Verified' }`
*   **Broadcast Manager & Settings**:
    *   **How it Works**: Admins send notification updates (Low/Medium/High priority) targeting students, teachers, or all.
    *   **Backend Connection**: `POST /api/announcements`
        *   *Payload*: `{ title, text, target, priority, date }`

---

## 4. Mocked and Simulated Features (Left to be Functional)

While the website operates as a functional portal, several features run on simulated bypass flows:

1.  **Online Payment Gateways**:
    *   *Current State*: In [ParentDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/ParentDashboard.jsx), card detail checks and UPI inputs are validated with UI form checks. No real credit card or bank API is contacted. Once confirmed, a dummy invoice record is sent to `/api/payments` and the student document's outstanding fee balance (`feeDue`) is reset to `0` via a PUT request.
2.  **Google OAuth API in Production**:
    *   *Current State*: If the backend or frontend lacks a configured Google Client ID in the environment variables, the system executes a dev-bypass mode ([Login.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/Login.jsx)). It generates a mock authentication token `mock-google-token-{email}` and bypasses security checkpoints to allow frontend previewing.
3.  **Resend Email Verification Sandboxing**:
    *   *Current State*: The authorization token for the Resend email service is hardcoded in the codebase ([authController.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/controllers/authController.js)). The system sends emails from `onboarding@resend.dev` to registered users. However, under Resend's free tier, emails *only* deliver to the single developer account that created the Resend login. Emails sent to real signup users will fail silently or be blocked by Resend.
4.  **Auto SMS and WhatsApp Reminders**:
    *   *Current State*: In the admin settings panel, toggles exist to enable/disable automated reminders (`autoReminders`, `whatsappSync`). In the actual backend code, no SMS engine (like Twilio) is connected. The toggles only modify boolean values in the database settings document.
5.  **Admin Notifications Persistence**:
    *   *Current State*: Admin notifications ([AdminDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/AdminDashboard.jsx)) and reminder-sent markers are saved in local storage (`localStorage.getItem('cograd_admin_notifications')`). They do not persist in MongoDB. If the admin logs in from a different device, their notification alerts history is lost.
6.  **Cloudinary Credentials Integration**:
    *   *Current State*: Document uploads are configured to use Cloudinary. However, if the server's `.env` is unconfigured, uploads fall back to local disk storage (`backend/uploads/`). Local storage will not work in serverless deployment platforms like Vercel or Render since their file systems are ephemeral (uploaded documents disappear whenever the server sleeps or restarts).

---

## 5. Process to Make Mocked Features Functional

To upgrade the website from a staging simulation to a functional production-grade platform, follow these developer implementation steps:

### A. Integrate Real Payment Gateways (e.g. Razorpay or Stripe)
*   **Step 1: Install Gateway SDKs**:
    *   Backend: Run `npm install stripe` (or `razorpay`) inside the `backend` folder.
    *   Frontend: Run `npm install @stripe/stripe-js` (or add Razorpay checkout scripts).
*   **Step 2: Create Checkout Sessions on the Backend**:
    *   Create a new route `POST /api/payments/checkout-session`.
    *   Write a controller function that initializes a payment intent:
        ```javascript
        import Stripe from 'stripe';
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        export const createCheckoutSession = async (req, res) => {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price_data: {
                currency: 'inr',
                product_data: { name: 'Tuition Fees' },
                unit_amount: req.body.amount * 100, // in paise/cents
              },
              quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/parent/dashboard?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL}/parent/dashboard?payment=fail`,
          });
          res.json({ id: session.id });
        };
        ```
*   **Step 3: Webhook Verification**:
    *   Configure a Stripe webhooks endpoint `/api/payments/webhook` to listen to `checkout.session.completed` events.
    *   Once a successful webhook is received from Stripe, update the `Payment` document and reset `feeDue` to `0` in MongoDB.

### B. Secure Google Sign-In
*   **Step 1: Setup Google Developer Console**:
    *   Create a project on [Google Cloud Console](https://console.cloud.google.com/).
    *   Setup the OAuth Consent Screen and generate an OAuth 2.0 Client ID.
    *   Configure Authorized JavaScript Origins (e.g. `https://cograd-pathshala-frontend.vercel.app`) and Redirect URIs.
*   **Step 2: Configure Environment Variables**:
    *   In the frontend `.env`, set `VITE_GOOGLE_CLIENT_ID` to your real Google Client ID.
    *   In the backend `.env`, set `GOOGLE_CLIENT_ID` to match.
*   **Step 3: Verify Sign-In Tokens on the Backend**:
    *   In the backend auth controller, install `google-auth-library` (`npm install google-auth-library`).
    *   Replace simulated user creation with real token verification:
        ```javascript
        import { OAuth2Client } from 'google-auth-library';
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        async function verifyGoogleToken(token) {
          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });
          return ticket.getPayload(); // Returns name, email, avatar
        }
        ```

### C. Live Email Delivery & Production Domains
*   **Step 1: Domain Verification**:
    *   Log in to your [Resend Dashboard](https://resend.com/).
    *   Add your custom domain (e.g. `cograd.in`) and configure the required MX, SPF, and DKIM DNS records inside your domain registrar (GoDaddy, Namecheap, Route 53).
*   **Step 2: Configure Backend Environment Variables**:
    *   Add your Resend API Key to your server's host dashboard.
    *   Update [authController.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/controllers/authController.js) and [api.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/routes/api.js) to retrieve the credentials dynamically:
        ```javascript
        const bearerToken = process.env.RESEND_API_KEY;
        const senderEmail = 'onboarding@cograd.in'; // Your verified domain email
        ```

### D. Connect Twilio for SMS and WhatsApp Reminders
*   **Step 1: Get Twilio Credentials**:
    *   Sign up at [Twilio](https://www.twilio.com/) and copy your `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and Messaging Service SID.
*   **Step 2: Install SDK**:
    *   Run `npm install twilio` in the backend folder.
*   **Step 3: Trigger Reminders Based on Settings Toggles**:
    *   Create a backend helper utility `sendSMS.js`:
        ```javascript
        import twilio from 'twilio';
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        export const sendSMS = async (to, body) => {
          await client.messages.create({
            body,
            to,
            from: process.env.TWILIO_PHONE_NUMBER
          });
        };
        ```
    *   In the Admin Broadcast flow or PTM Scheduler, query the `AdminSettings` collection. If `autoReminders` or `whatsappSync` is `true`, call the SMS utility.

### E. Persist Admin Notifications in MongoDB
*   **Step 1: Create a Notification Schema**:
    *   Add a new model `Notification.js`:
        ```javascript
        const NotificationSchema = new mongoose.Schema({
          title: String,
          text: String,
          role: String, // 'admin', 'teacher', etc.
          isRead: { type: Boolean, default: false }
        }, { timestamps: true });
        ```
*   **Step 2: Add API Endpoints**:
    *   Create `GET /api/notifications` and `PUT /api/notifications/:id/read` endpoints in `api.js`.
*   **Step 3: Refactor frontend**:
    *   Replace the local storage hooks in [AdminDashboard.jsx](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/src/pages/AdminDashboard.jsx) with React `useEffect` data-fetches and API update triggers targeting the backend notification routes.

---

## 6. Production Launch & Deployment Checklist

Before handing the platform over to production users, complete the following deployment checklist:

### 1. Database Provisioning & IP Whitelisting
*   Do not use local MongoDB or local disk storage in production. Setup a managed database cluster using [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) (free/shared tier is suitable for initial launch).
*   **Crucial Step**: In the Network Access settings of MongoDB Atlas, whitelist all IP addresses (`0.0.0.0/0`) since cloud servers like Render or Vercel use dynamic outbound IP addresses that change frequently.

### 2. Configure Cloudinary File Storage
*   Register a production account on Cloudinary.
*   Configure the database backend's environment variables:
    *   `CLOUDINARY_CLOUD_NAME`
    *   `CLOUDINARY_API_KEY`
    *   `CLOUDINARY_API_SECRET`
*   Verify that files uploaded from the teacher registration flow successfully store in Cloudinary CDN and generate permanent `https://res.cloudinary.com/` file URLs.

### 3. Deploy the Express Backend
*   **Hosting Recommendation**: Deploy the `backend` folder to **Render**, **Railway**, or **Heroku**.
*   **Configuring Environment Variables**: Enter the production values in the hosting dashboard's settings:
    *   `PORT=10000` (or leave default for Render)
    *   `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cograd`
    *   `JWT_SECRET` = (Generate a strong random 32-character string)
    *   `CLOUDINARY_URL` / Credentials
    *   `RESEND_API_KEY`
    *   `NVIDIA_API_KEY`
    *   `GOOGLE_CLIENT_ID`
*   Enable **"Auto-Deploy"** connected to your repository's production branch (`main`).

### 4. Deploy the React Frontend
*   **Hosting Recommendation**: Deploy the `frontend` folder to **Vercel** or **Netlify**.
*   **Build Settings**:
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
    *   Framework Preset: `Vite`
*   **Environment Variables**:
    *   `VITE_API_URL` = `https://your-backend-render-url.com/api`
    *   `VITE_GOOGLE_CLIENT_ID` = `your_google_client_id_here`
*   **Single-Page Router Handling**: Ensure that Vercel configuration routes all dynamic paths back to `index.html` to prevent `404 Not Found` errors when refreshing dashboard links. This is configured in the repository's [vercel.json](file:///Users/harshit/Downloads/Cograd-Pathshala-main/frontend/vercel.json):
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
    }
    ```

### 5. Custom Domain & SSL Mapping
*   Map your domains:
    *   Landing site: `www.cograd.in` or `cograd.in` (Points to Vercel/Netlify CNAME records).
    *   API Backend sub-domain: `api.cograd.in` (Points to Render / Railway CNAME records).
*   Double check that SSL certificates (HTTPS) are automatically provisioned and enabled for both domains (Vercel and Render handle this automatically).
*   **Tighten CORS Rules**: In [server.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/server.js), change the CORS origin from `'*'` to your exact frontend domain URL to secure backend endpoints:
    ```javascript
    app.use(cors({
      origin: 'https://cograd.in',
      exposedHeaders: ['Content-Disposition'],
    }));
    ```

### 6. Remove Seeding & Debug Endpoints
*   **Disable Cloudinary Debugger**: In [server.js](file:///Users/harshit/Downloads/Cograd-Pathshala-main/backend/src/server.js), delete or block the `/api/debug-cloudinary` endpoint to prevent third-party actors from sniffing environment details.
*   **Secure Default Admin Account**: Change the default admin credentials seeded on startup (`cograd@admin.in` / `CoGrad@Amin543` or `admin@cograd.com` / `password`) or remove the `seedData` routine entirely to avoid security vulnerabilities.
