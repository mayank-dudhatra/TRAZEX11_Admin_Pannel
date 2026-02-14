# Trazex Admin Dashboard

A comprehensive admin panel for managing the Trazex fantasy stock trading platform. Built with React 19, Vite, and Tailwind CSS, featuring a modern glassmorphic design with secure authentication and complete contest management capabilities.

## 🚀 Features

### Authentication & Security
- **Secure Cookie-Based Authentication**: HttpOnly cookies prevent XSS attacks
- **Auto Session Management**: Automatic logout on session expiry
- **Role-Based Access Control**: Admin-only operations with middleware protection
- **Credentials Management**: Fetch API with `credentials: 'include'` for secure cookie handling

### Dashboard Analytics
- **Real-Time System Health**: Monitor database connectivity, API status, and uptime
- **User Metrics**: Track total users, active users, suspended accounts, and new signups
- **Growth Analytics**: Visualize user growth trends over time
- **Risk Monitoring**: Flag suspicious activities and security anomalies
- **Login Success Rate**: Track authentication success metrics

### User Management
- **Complete CRUD Operations**: Create, read, update, and delete user accounts
- **Pagination System**: Display 8 users per page with prev/next navigation
- **Profile Inspection**: View detailed user information including registration date, last login
- **Status Management**: Toggle user accounts between active and suspended states
- **Account Deletion**: Remove users with proper confirmation flow
- **Filtering**: Filter users by status (all, active, suspended)
- **Search & Moderation**: Tools for efficient user monitoring

### Contest Management System

#### DateContest Operations
- Create parent contest cards for daily, weekly, or monthly cycles
- Define market type (NSE/BSE)
- Set date ranges for contest availability
- Manage contest card activation status

#### Contest Creation
- **DateContest Integration**: Select parent date contest from dropdown
- **Contest Details**: Name, timing, entry fees, spots, team limits
- **Dynamic Prize Distribution Builder**:
  - Rank range input (Rank From → Rank To)
  - Prize per winner
  - Auto-calculated winners count: `(rankTo - rankFrom + 1)`
  - Auto-calculated total prize: `winners × prizeEach`
  - Add/remove multiple prize ranges
  - Real-time validation

#### Contest Schedule View
- **Date Range Filtering**: View contests between From Date and To Date (default: 7-day range)
- **Market Selection**: Filter by NSE or BSE market type
- **Contest Table Display**:
  - Contest Name
  - Duration Type (Daily/Weekly/Monthly)
  - Entry Close Time
  - Start Time
  - End Time
  - Status Badge (Upcoming/Live/Ended)
  - Entry Fee
  - Prize Pool
  - Total Spots
- **Details Modal**: Click "View Details" for comprehensive contest information

#### Contest Details Modal
- **Prize Breakup Table**:
  - Rank From | Rank To | Winners | Prize Each | Total Prize
  - Currency formatting with ₹ symbol
  - Clear visualization of distribution
- **Leaderboard Display**:
  - Current rank with colored badges (🥇🥈🥉)
  - Team name and owner
  - Total points scored
  - Prize won (auto-calculated based on rank)
  - Real-time updates

### UI/UX Design
- **Glassmorphic Theme**: Modern dark theme with glass effects
- **Neon Accents**: Cyan-400 highlights for interactive elements
- **Responsive Layout**: Sidebar navigation + main content area
- **Smooth Animations**: Transitions and hover effects throughout
- **Background Glow**: Animated gradient effects for visual depth
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Sticky Headers**: Keep context visible while scrolling
- **Toast Notifications**: Success/error feedback

## 📁 Project Structure

```
Admin/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Images, icons, and media files
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginScreen.jsx           # Admin login form
│   │   ├── common/
│   │   │   └── BackgroundGlow.jsx        # Animated background effects
│   │   ├── layout/
│   │   │   ├── DashboardHeader.jsx       # Page header with metrics
│   │   │   └── Sidebar.jsx               # Navigation sidebar
│   │   └── sections/
│   │       ├── ContestDetailsModal.jsx   # Prize & leaderboard modal
│   │       ├── ContestSchedule.jsx       # Contest schedule table
│   │       ├── CreateContest.jsx         # Contest creation form
│   │       ├── CreateDateContest.jsx     # Date contest form
│   │       ├── MetricCards.jsx           # Dashboard stat cards
│   │       ├── RiskFlags.jsx             # Security alerts
│   │       ├── SystemHealth.jsx          # Health monitoring
│   │       ├── UserGrowth.jsx            # Analytics chart
│   │       ├── UserModeration.jsx        # User table & actions
│   │       └── UserProfile.jsx           # User detail viewer
│   ├── constants/
│   │   └── dashboard.js                  # Initial state & config
│   ├── services/
│   │   └── adminApi.js                   # API client service
│   ├── utils/
│   │   └── authStorage.js                # Auth utilities (legacy)
│   ├── App.jsx                           # Main application component
│   ├── App.css                           # Application styles
│   ├── main.jsx                          # React entry point
│   └── index.css                         # Global styles with Tailwind
├── .env                                  # Environment variables
├── .gitignore                            # Git ignore rules
├── eslint.config.js                      # ESLint configuration
├── index.html                            # HTML entry point
├── package.json                          # Dependencies & scripts
├── postcss.config.js                     # PostCSS configuration
├── tailwind.config.js                    # Tailwind CSS config
├── vite.config.js                        # Vite build config
└── README.md                             # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Backend API running on port 3001 (or configured port)

### Setup Steps

1. **Navigate to Admin directory**
   ```bash
   cd Admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the Admin directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The admin panel will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📚 Navigation Pages

### 1. Overview (Dashboard Home)
- System health status
- Key metrics cards (users, active, suspended, new signups)
- User growth chart
- Risk flags and alerts
- Login success rate
- Average session duration

### 2. User Management
- User table with pagination
- Profile detail panel
- Status toggle (active/suspended)
- Delete user functionality
- Filter by account status
- Top locations statistics

### 3. Date Contests
- Create parent contest cards
- Select duration type (daily/weekly/monthly)
- Choose market (NSE/BSE)
- Set date ranges (start/end)
- Manage card activation

### 4. Contests
- Create contests linked to date cards
- DateContest dropdown selector
- Contest timing configuration
- Financial details (entry fee, spots, prize pool)
- Prize distribution builder with auto-calculations
- Maximum teams per user setting

### 5. Risk & Safety
- Security alert monitoring
- Suspicious activity flags
- User behavior analytics
- Violation tracking

### 6. Contest Cards (Schedule)
- View contests across date ranges
- Filter: From Date, To Date, Market Type
- Contest status indicators
- Entry/start/end times
- View details modal with prize breakup and leaderboard

## 🔐 Authentication Flow

1. **Login Process**:
   - User enters admin credentials (email/password)
   - Backend validates and sets httpOnly cookie
   - Frontend receives user data (no token exposed)
   - Auto-redirect to dashboard

2. **Session Management**:
   - Cookie automatically included with all API requests
   - Backend validates cookie on each protected route
   - Expired or invalid cookies trigger logout
   - Unauthorized callback clears session

3. **Logout**:
   - Call `/auth/logout` endpoint
   - Backend clears httpOnly cookie
   - Frontend resets authentication state
   - Redirect to login screen

## 🌐 API Integration

### Base Configuration
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
```

### Key API Endpoints

#### Authentication
- `POST /auth/login` - Admin login with credentials
- `POST /auth/logout` - Clear session cookie

#### Admin Operations
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/users?page=1&limit=8` - Paginated user list
- `GET /admin/users/:id` - User details
- `PUT /admin/users/:id/status` - Update user status
- `DELETE /admin/users/:id` - Delete user

#### Contest Management
- `POST /admin/date-contests` - Create date contest
- `GET /admin/date-contests` - List date contests
- `POST /admin/contests` - Create contest
- `GET /admin/contests?from=YYYY-MM-DD&to=YYYY-MM-DD&market=NSE` - Filter contests
- `GET /admin/contests/:id` - Contest details with leaderboard

### API Service Configuration

All API calls use:
```javascript
credentials: 'include'  // Include httpOnly cookies
```

## 🎨 Design System

### Color Palette
- **Primary**: `cyan-400` (Neon accent)
- **Background**: `#0f0f1a` (Night)
- **Surface**: `#1a1a2e` (Slate)
- **Text Primary**: `white`
- **Text Secondary**: `white/70` (Haze)
- **Border**: `white/10`

### Components
- **Glass Effect**: `bg-white/5` with `backdrop-blur`
- **Rounded Corners**: `rounded-2xl`, `rounded-3xl`
- **Borders**: `border border-white/10`
- **Hover States**: `hover:border-white/30`, `hover:bg-white/5`
- **Transitions**: `transition-all duration-300`

### Responsive Breakpoints
- **Mobile**: `< 768px` (default)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

## 🧪 Development

### Available Scripts

```bash
# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint
```

### Development Tips

1. **Hot Module Replacement**: Changes reflect instantly without full reload
2. **React DevTools**: Install browser extension for component inspection
3. **Tailwind IntelliSense**: Use VS Code extension for class autocomplete
4. **ESLint**: Auto-fix on save for consistent code style

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |

## 📦 Technologies

### Core
- **React** `19.2.0` - UI library with latest features
- **React DOM** `19.2.0` - DOM rendering
- **Vite** `7.2.4` - Build tool and dev server

### Styling
- **Tailwind CSS** `3.4.15` - Utility-first CSS framework
- **PostCSS** `8.4.47` - CSS processing
- **Autoprefixer** `10.4.20` - Vendor prefix automation

### Development Tools
- **ESLint** `9.39.1` - Code linting
- **@vitejs/plugin-react** `5.1.1` - React plugin for Vite
- **eslint-plugin-react-hooks** - React Hooks linting
- **eslint-plugin-react-refresh** - Fast Refresh validation

## 🔒 Security Features

- **HttpOnly Cookies**: JWT tokens never exposed to JavaScript
- **XSS Protection**: Cookies inaccessible via `document.cookie`
- **CSRF Protection**: SameSite strict cookie policy
- **Secure Flag**: Cookies sent only over HTTPS in production
- **Credentials Include**: Automatic cookie transmission
- **Auto Logout**: Session expiry detection and cleanup

## 🚀 Deployment

### Production Build

```bash
npm run build
```

Output directory: `dist/`

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Static Hosting Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- Render
- GitHub Pages

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name admin.trazex.com;
    root /var/www/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional)
    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Trazex Development Team

---

**Note**: This admin panel requires the Trazex Backend API to be running. Ensure the backend is configured with proper CORS settings to allow requests from the admin panel domain.
