TouchPlay - Waitlist & Analytics Platform 🚀
![alt text](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![alt text](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![alt text](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![alt text](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![alt text](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
This repository contains the complete frontend and backend-as-a-service implementation for the TouchPlay waitlist. It's an AI-native platform designed for mobile game marketers to generate high-ROI playable ads. The application includes a public-facing landing page, a secure waitlist submission system, and a private admin dashboard for viewing analytics.
Live Demo (Replace with your actual Vercel deployment URL)
✨ Key Features
Public Landing Page: A modern, responsive landing page to attract users and capture emails.
Secure Waitlist: Submissions are protected against bots with a honeypot field and IP-based rate limiting.
Email Verification: New signups receive a verification email (via Resend) to confirm their address and secure their spot.
YC-Level Analytics Dashboard: A private, password-protected /intel route for admins.
Data Visualization: The dashboard includes charts for daily signups, country distribution, and traffic sources.
User Data Management: Admins can view, export to CSV, and manage waitlist entries.
Serverless Backend: Powered by Supabase for database, authentication (for admin), and Row Level Security.
Edge Deployment: Optimized for fast global delivery with Vercel.
🛠️ Tech Stack
Frontend: React 18, Vite
Styling: Tailwind CSS
Backend & Database: Supabase (PostgreSQL, Auth, Row Level Security)
Email Service: Resend
Deployment: Vercel
<details>
<summary><strong>🗂️ View Full Project Structure</strong></summary>
touchplay-waitlist/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── EmailVerification.jsx
│   ├── utils/
│   │   ├── supabase.js
│   │   ├── rateLimiter.js
│   │   ├── emailService.js
│   │   └── analytics.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
</details>
🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.
Prerequisites
Node.js: v18.18.0 or v20.x.x
npm: v9.8.1 or higher
A Supabase account (Free tier is sufficient)
A Resend account for sending emails
1. Clone the Repository
git clone https://github.com/your-username/touchplay-waitlist.git
cd touchplay-waitlist
2. Install Dependencies
npm install
3. Set Up Environment Variables
Create a file named .env.local in the root of the project by copying the example file:
cp .env.local.example .env.local
Now, open .env.local and add your secret keys.
# Get these from your Supabase project settings > API
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Get this from your Resend account > API Keys
VITE_RESEND_API_KEY="your-resend-api-key"
4. Set Up the Supabase Database
Navigate to Supabase.io and create a new project.
Once the project is ready, go to the SQL Editor from the left sidebar.
Click + New query.
Copy the entire content of the SQL schema below and paste it into the editor.
Click RUN. This will create all the necessary tables, policies, and indexes.
<details>
<summary><strong>🗄️ View Supabase SQL Schema</strong></summary>
-- Create waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX idx_waitlist_verified ON waitlist(verified);
CREATE INDEX idx_waitlist_country ON waitlist(country);
CREATE INDEX idx_waitlist_utm_source ON waitlist(utm_source);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Allow public insert" ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for verification" ON waitlist FOR SELECT USING (true);
CREATE POLICY "Allow public update for verification" ON waitlist FOR UPDATE USING (true);

-- Insert default admin (password: touchplay2024)
INSERT INTO admin_users (email, password_hash) VALUES 
('admin@touchplay.ai', '$2b$10$rKzKzKzKzKzKzKzKzKzKzO');
</details>
5. Run the Development Server
You are now ready to run the application!
npm run dev
The application will be available at http://localhost:3000.
📜 Available Scripts
In the project directory, you can run:
npm run dev: Runs the app in development mode with Hot-Module-Replacement.
npm run build: Builds the app for production to the dist folder.
npm run lint: Lints the project files for code quality and errors.
npm run preview: Serves the production build locally to preview before deployment.
☁️ Deployment
This project is optimized for deployment on Vercel.
Push your code to a GitHub/GitLab/Bitbucket repository.
Go to your Vercel Dashboard and import the repository.
Configure Project Settings:
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Add Environment Variables: Before deploying, add the same environment variables from your .env.local file to the Vercel project settings (Go to Project > Settings > Environment Variables).
Click Deploy.
Your vercel.json file is already configured to handle rewrites, ensuring that direct navigation to /intel or /verify works correctly with the Single Page Application (SPA) routing.