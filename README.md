# Postly — AI-Powered Social Media Manager

A full-stack social media management tool that lets businesses create, generate, and publish posts across multiple platforms from a single dashboard — powered by Google Gemini AI.

## Demo

> Add screenshots here after taking them from the app

## Features

- **AI Caption Generation** — Describe your post idea, Gemini 2.5 Flash writes platform-optimized captions automatically
- **Multi-Platform Posting** — Post to LinkedIn and Facebook simultaneously with one click
- **Business Profile Management** — Manage multiple business profiles with custom tones and platform settings
- **Post Scheduling** — Schedule posts for a future date and time
- **Make.com Automation** — Backend powered by Make.com for reliable posting and Google Sheets logging
- **Light / Dark Theme** — Clean professional UI with theme toggle
- **Post History Logging** — Every post logged to Google Sheets automatically

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| AI Generation | Google Gemini 2.5 Flash API |
| Backend Automation | Make.com (webhook-based) |
| LinkedIn Posting | Make.com LinkedIn module |
| Facebook Posting | Make.com Facebook Pages module |
| Post Logging | Google Sheets via Make.com |
| Styling | Custom CSS with light/dark theme system |

## Architecture

```
React App (Postly)
      |
      | POST webhook (post content + platforms)
      v
   Make.com Scenario
      |
   Router
      |---> LinkedIn API
      |---> Facebook Pages API
      |---> Google Sheets (logging)
      |
   Webhook Response (success/error back to app)
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- A Make.com account (free trial available)
- Google Gemini API key (free at aistudio.google.com)

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOURUSERNAME/postly.git
cd postly
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open `http://localhost:5173` in your browser

### Configuration

1. **Gemini API Key**
   - Go to [aistudio.google.com](https://aistudio.google.com)
   - Create a new API key
   - Add it in the app under API Settings

2. **Make.com Setup**
   - Import the blueprint from `make-blueprint/` folder
   - Connect your LinkedIn and Facebook accounts
   - Copy the webhook URL into `src/App.jsx` (replace `MAKE_WEBHOOK` constant)

3. **Social Accounts**
   - Connect LinkedIn and Facebook via Make.com credentials
   - No manual API keys needed for these platforms

## Make.com Blueprint

The `make-blueprint/` folder contains instructions for setting up the automation backend.

Import the scenario into Make.com to get:
- Webhook receiver
- LinkedIn posting
- Facebook posting  
- Google Sheets logging
- Webhook response back to the app

## Project Structure

```
postly/
├── src/
│   ├── App.jsx          # Main application (all components)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global reset
├── make-blueprint/      # Make.com scenario export
├── public/              # Static assets
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Roadmap

- [ ] Instagram posting support
- [ ] Twitter/X posting support
- [ ] Post History tab with Google Sheets integration
- [ ] Analytics dashboard
- [ ] Multi-user support with Supabase auth
- [ ] Stripe payments for SaaS version

## License

MIT License - feel free to use this for your own projects.

---

Built with React, Gemini AI, and Make.com
