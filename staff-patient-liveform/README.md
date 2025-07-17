# Real-Time Patient Form with Staff Monitoring

This project demonstrates a real-time form system where:
- A patient fills out a medical form
- A staff dashboard receives real-time updates about the patient's status

---

## 🌐 Live Demo
🔗 https://your-app.vercel.app

---

## 🧩 Features

- Real-time updates using **WebSockets (Socket.IO)**
- Form validation (required fields, phone, email)
- Responsive design for both desktop and mobile
- Submission confirmation and redirect
- Staff dashboard for monitoring activity and submission

---

## 🧠 Development Overview

### 📁 Project Structure



```

/src
├── /app
│   ├── layout.tsx      ← Starts WebSocket server
│   └── page.tsx        ← Main home with navigation
├── /pages
│   ├── /api/socket.ts  ← WebSocket endpoint
│   ├── /patient/[id].tsx  ← Patient form
│   └── staff.tsx       ← Staff dashboard
├── /lib/socket.ts      ← Socket client

```


### 🎨 Design Decisions

- Used plain CSS-in-JS for rapid prototyping and control
- Split patient vs staff view for clarity
- Responsive UI using simple max-width and spacing
- Accessible inputs and semantic HTML

### 🧱 Component Architecture

- `PatientForm` → Input form + live typing emission
- `StaffDashboard` → Listener showing current state
- `Socket.IO` → Backend transport layer in `api/socket.ts`

### 🔄 Real-Time Synchronization Flow

```txt
Patient → emits 'editing-started' / 'editing-stopped' / 'form-submitted'
       ↓
Socket.IO API → broadcasts 'patient-editing' event
       ↓
Staff → listens to 'patient-editing' and updates UI

✅ How to Run Locally
```
```
git clone https://github.com/your-username/patient-live-form.git
cd patient-live-form
npm install
npm run dev
```

# 📦 Tech Stack
Next.js (TypeScript)

Socket.IO

Vercel (for deployment)


