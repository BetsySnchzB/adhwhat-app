# A-D-H-WHAT? — ADHD Support App

A Next.js + Supabase app that helps users plan their day, track mood/energy, and manage tasks with simple dopamine-friendly flows.

## Live Demo
- (add your Vercel URL here)

## Features
- **Landing page** at `/adwhat` with n8n-powered email capture
- **Auth** via Supabase at `/auth`
- **Dashboard** at `/dashboard`:
  - Add tasks, mark complete, instant list updates
  - Mood & energy check-ins (saved to Supabase)
  - Daily tip carousel
- **Security**: secrets via `.env.local` (not committed). Example files included.

## Tech
- Next.js 14, TypeScript, Tailwind CSS
- Supabase (Auth + DB)
- n8n (lead capture automations)
- (ChatCoach is WIP and disabled in production)

## Local Setup
```bash
git clone https://github.com/BetsySnchzB/adhwhat-app.git
cd adhwhat-app
cp .env.example .env.local        # fill in your values
cp mcp_config.example.json mcp_config.local.json  # optional
npm install
npm run dev
