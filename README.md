# MariaAI - AI Agency OS

An all-in-one platform to manage clients, projects, proposals, and invoices in one single place. Running an agency requires managing multiple tools, so this dashboard helps to keep everything organized. 

It is built with Next.js, Supabase, Tailwind CSS, and TanStack Query.

## Features

- Client Management: Track clients, their subscription plans, and monthly recurring revenue (MRR) in real time.
- Proposals and Contracts: Create proposals and contracts directly in the dashboard and link them to specific clients.
- Invoicing: Generate and track invoice status (pending, paid, overdue).
- Automations: Simple workflow triggers for standard notifications or manual runs.
- Team Management: Add and invite team members with specific roles like developer, manager, or designer.
- AI Chat Copilot: An assistant to help draft proposals or answer queries about clients and projects.

## Local Setup

Follow these steps to run the project on your local machine:

1. Clone this repository to your computer:
   ```bash
   git clone https://github.com/pufuki/MariaAI.git
   cd MariaAI
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Now open http://localhost:3000 in your browser to view the application.

## Database Setup

This project uses Supabase as the backend database. You can find the database schema and security policies in the migration folder

To set up the database:
1. Create a new project in Supabase.
2. Go to the SQL Editor in your Supabase dashboard.
3. Copy the contents of the migration file and run it. This will create all the required tables (clients, proposals, contracts, invoices, automations, team_members, chat_messages) with Row Level Security (RLS) policies.

## Tech Stack

- Frontend: Next.js (App Router), React, Tailwind CSS, GSAP (for animations)
- State Management & Fetching: Zustand, TanStack React Query
- Backend & Auth: Supabase (PostgreSQL with RLS)
- Icons: Lucide React

Feel free to fork this project or open an issue if you find any bugs.
