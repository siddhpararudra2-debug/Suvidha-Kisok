# SUVIDHA - Smart Urban Virtual Interactive Digital Helpdesk Assistant

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20+-green.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)

A unified civic services kiosk application for Indian citizens to access Electricity, Gas, and Water/Municipal services through a single touchpoint.

## 🎯 Features

### 🔐 Authentication
- Aadhaar OTP Login
- Consumer ID Login
- DigiLocker OAuth (simulated)
- Guest Mode with limited access
- JWT tokens with 15-min expiry

### 🏠 Dashboard
- Outstanding bills summary with "Pay All"
- Active complaints tracker
- Service cards grid
- Real-time status indicators

### ⚡ Utility Services
- **Electricity**: Bill view, payment, consumption analytics, outage reporting
- **Gas**: PNG billing, CNG station locator, safety information, emergency gas leak
- **Water**: Water/property tax, tanker requests, supply schedule

### 📍 Interactive Maps
- Infrastructure layers (substations, pipelines, CNG stations)
- Real-time outage overlays
- Location search

### 📝 Complaint System
- 3-step registration wizard
- GPS location capture
- Timeline tracking
- Officer assignment & escalation

### ♿ Accessibility
- 12 Indian languages including RTL Urdu
- 3 text size options
- High contrast mode
- Dark mode
- Voice assistance toggle

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository>
cd hackathon
npm install

# Run development servers
npm run dev

# Or run separately
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:4000
```

## 🔧 Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Material UI + Tailwind CSS
- Redux Toolkit
- react-i18next (12 languages)
- Framer Motion animations
- Leaflet.js (maps)

**Backend:**
- Node.js + Express + TypeScript
- JWT authentication
- Socket.io (real-time)
- Zod validation

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # Screen components
│   │   ├── store/          # Redux slices
│   │   ├── i18n/           # Translations
│   │   └── styles/         # Theme & CSS
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Error handling
│   │   └── utils/          # Logging
│   └── tsconfig.json
└── package.json            # Monorepo workspace
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/aadhaar/send-otp` | Send Aadhaar OTP |
| POST | `/api/auth/aadhaar/verify-otp` | Verify and login |
| POST | `/api/auth/guest` | Guest login |
| GET | `/api/bills` | Get user bills |
| POST | `/api/bills/:id/pay` | Pay a bill |
| POST | `/api/complaints` | Register complaint |
| GET | `/api/complaints/:id` | Track complaint |
| GET | `/api/infrastructure/layers` | Map layers |
| GET | `/api/infrastructure/status` | Live status |

## 🎨 Design Tokens

| Token | Value |
|-------|-------|
| Primary Blue | #1A73E8 |
| Success Green | #34A853 |
| Warning Yellow | #FBBC04 |
| Danger Red | #EA4335 |
| Touch Target Min | 48px |
| Touch Target Preferred | 100px |

## 📝 License

MIT License - C-DAC Hackathon 2026

---

Built with ❤️ for Indian Citizens
