# SUVIDHA - System Design Document

## 1. Overview

SUVIDHA (Smart Urban Virtual Interactive Digital Helpdesk Assistant) is a unified civic services kiosk application enabling Indian citizens to access Electricity, Gas, and Water/Municipal services through a single digital interface.

### 1.1 Goals
- Provide single-window access to multiple utility services
- Support 12 Indian languages including RTL (Urdu)
- Ensure accessibility for senior citizens and differently-abled users
- Enable offline-first operation for kiosk deployments
- Achieve 99.9% uptime for critical services

### 1.2 Key Metrics
- Target response time: <200ms for API calls
- Session timeout: 3 minutes (kiosk security)
- Concurrent users per kiosk: 1 (touch interface)
- Data retention: 7 years (regulatory compliance)

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React 18)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Welcome  │ │Dashboard │ │ Services │ │  Admin   │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       └────────────┴────────────┴────────────┘                  │
│                        Redux Store                              │
│           ┌────────────────────────────────┐                   │
│           │ Auth │ Services │ UI Slices   │                    │
│           └──────────────┬─────────────────┘                   │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS/WSS
┌──────────────────────────┼──────────────────────────────────────┐
│                    NGINX (Reverse Proxy)                        │
│                     Load Balancing / SSL                        │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   Auth   │ │  Bills   │ │Complaints│ │  Infra   │           │
│  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       └────────────┴────────────┴────────────┘                  │
│                     Middleware Layer                            │
│           ┌────────────────────────────────┐                   │
│           │ JWT Auth │ Rate Limit │ Logger │                   │
│           └──────────────┬─────────────────┘                   │
└──────────────────────────┼──────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
┌────────▼───────┐ ┌───────▼───────┐ ┌───────▼───────┐
│   PostgreSQL   │ │     Redis     │ │  Socket.io    │
│   (Primary DB) │ │    (Cache)    │ │  (Real-time)  │
└────────────────┘ └───────────────┘ └───────────────┘
```

---

## 3. Component Details

### 3.1 Frontend Stack
| Component | Technology | Purpose |
|-----------|------------|---------|
| UI Framework | React 18 | Component-based UI |
| State Management | Redux Toolkit | Centralized state |
| Styling | MUI + Tailwind | Design system |
| Routing | React Router 6 | SPA navigation |
| i18n | react-i18next | 12 languages |
| Maps | Leaflet.js | Infrastructure maps |
| Animations | Framer Motion | Smooth UX |

### 3.2 Backend Stack
| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 20 | JavaScript runtime |
| Framework | Express 4 | HTTP server |
| Validation | Zod | Schema validation |
| Auth | JWT + bcrypt | Token-based auth |
| Real-time | Socket.io | Live updates |
| Logging | Pino | Structured logs |

### 3.3 Data Layer
| Store | Technology | Purpose |
|-------|------------|---------|
| Database | PostgreSQL 16 | Primary data store |
| Cache | Redis 7 | Session, rate limits |
| Files | S3/MinIO | Document storage |

---

## 4. Data Models

### 4.1 User
```sql
users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255),
  mobile VARCHAR(15) UNIQUE,
  email VARCHAR(255),
  aadhaar_masked VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP
)
```

### 4.2 Bill
```sql
bills (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  type ENUM('electricity','gas','water'),
  bill_number VARCHAR(100) UNIQUE,
  amount DECIMAL(10,2),
  due_date DATE,
  status ENUM('unpaid','paid','overdue')
)
```

### 4.3 Complaint
```sql
complaints (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  type VARCHAR(20),
  category VARCHAR(100),
  priority ENUM('low','medium','high','emergency'),
  status VARCHAR(30),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
)
```

---

## 5. Security

### 5.1 Authentication Flow
1. User enters Aadhaar number
2. Backend calls UIDAI API to send OTP
3. User enters 6-digit OTP
4. Backend verifies OTP
5. JWT token issued (15 min expiry)
6. Refresh token for session extension

### 5.2 Security Measures
- **JWT**: 15-minute expiry, RS256 signing
- **Session Timeout**: 3-minute inactivity for kiosks
- **Rate Limiting**: 100 requests/minute per IP
- **Input Validation**: Zod schemas on all endpoints
- **SQL Injection**: Parameterized queries
- **XSS**: React's automatic escaping
- **CORS**: Whitelist specific origins
- **HTTPS**: TLS 1.3 in production

---

## 6. Scalability

### 6.1 Horizontal Scaling
- Stateless API servers behind load balancer
- Redis for session storage (not in-memory)
- Database connection pooling (max 20/server)

### 6.2 Caching Strategy
| Data | TTL | Cache |
|------|-----|-------|
| Live status | 30s | Redis |
| User session | 15m | Redis |
| Infrastructure GeoJSON | 1h | CDN |
| Static assets | 1y | CDN |

### 6.3 Estimated Capacity
- 100 concurrent kiosks per backend instance
- 10,000 requests/minute with 2 instances
- PostgreSQL: 1M bills, 100K users

---

## 7. Deployment

### 7.1 Docker Containers
```
suvidha-web     → Nginx (frontend)
suvidha-api     → Node.js (backend)
suvidha-db      → PostgreSQL
suvidha-cache   → Redis
```

### 7.2 Environment Variables
```
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<256-bit secret>
AADHAAR_API_KEY=<UIDAI sandbox key>
```

### 7.3 Monitoring
- **Metrics**: Prometheus + Grafana
- **Logs**: Pino → Loki
- **Uptime**: Healthcheck endpoints
- **Alerts**: PagerDuty integration

---

## 8. Future Enhancements

1. **Biometric Auth**: Fingerprint/face via kiosk hardware
2. **Voice Commands**: Speech-to-text for accessibility
3. **Offline Mode**: PWA with IndexedDB sync
4. **AI Chatbot**: Gemini-powered support agent
5. **Analytics**: Power BI integration
