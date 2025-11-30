# Tesla Battery Site Planner

A modern, interactive web application for designing and configuring industrial battery site layouts. Built to help customers visualize and plan their energy storage infrastructure.

## Overview

This application allows users to mockup and configure industrial battery sites with an intuitive drag-and-drop interface. Users can select from various battery types, automatically generate optimal layouts, and save/load configurations for future reference.

**Live Demo:** https://tesla-battery-site.vercel.app/

## Features

### Core Functionality

- **Interactive Battery Configuration** - Select and configure multiple battery types with real-time calculations
- **Auto-Generated Layouts** - Auto-packing algorithm optimally arranges batteries within a fixed width constraint
- **Manual Layout Mode** - Drag-and-drop interface for custom battery arrangements
- **Transformer Auto-Calculation** - Automatically adds 1 transformer for every 2 industrial batteries
- **Cloud Save/Load** - Persist configurations across devices using cloud saves
- **Dark Mode** - Toggle between light and dark mode
- **Cost & Energy Breakdown** - Detailed breakdown of costs and energy by device type
- **Virtual List Support** - Efficiently handles up to 10,000 devices per device type with optimized rendering
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 22+ and pnpm installed

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/himankpathak/tesla-battery-site-builder.git
cd tesla-battery-site-builder

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

The application will be available at **http://localhost:8000**

### Firebase Setup

To enable cloud save functionality, add your Firebase configuration:

1. Create a `.env.local` file in the root directory (see [.example.env](.example.env) for reference)
2. Add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Note: If you want to run the development server without Firebase keys, check out this [commit](https://github.com/himankpathak/tesla-battery-site-builder/commit/e6f7a3038c7d7ad87f538cd2b1400e6c6d23fb66) which will work without the API keys.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **dnd-kit** - Drag-and-drop functionality
- **next-themes** - Theme and Dark mode support
- **Lucide React** - Icon library

### Backend & Storage

- **Firebase** - Cloud storage and authentication

## Project Structure

```
tesla-battery-site-builder/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── globals.css   # App color palette
│   │   ├── layout.tsx    # Root layout component
│   │   ├── page.tsx      # Landing page
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── navbar.tsx    # Navigation bar
│   │   ├── layout-display.tsx    # Battery layout visualization
│   │   ├── summary-panel.tsx     # Statistics and calculations
│   │   ├── auth-modal.tsx        # Auth modal
│   │   └── ...
│   ├── contexts/        # React contexts
│   ├── lib/            # Libraries, utility functions and constants
├── public/             # Static assets
└── package.json
```

## Usage

1. **Configure Batteries**
   - Use the input panel to select quantity for each battery type
   - View real-time updates for cost, energy, and land area
   - Transformers are automatically calculated (1 per 2 batteries)

2. **View Layout**
   - Toggle between Auto Layout and Manual Layout modes
   - **Auto Layout**: Algorithm automatically arranges batteries optimally
   - **Manual Layout**: Drag and move batteries to customize arrangement
   - Constraints set within the app:
     - Maximum layout width: 100ft
     - Horizontal and vertical spacing between batteries: 2ft
     - Maximum batteries allowed of each type: 10000

3. **View Detailed Breakdown**
   - Click Summary cards to see detailed cost and energy breakdown by device type
   - Save configuration on the cloud after signing in

## Design Decisions

### Layout Algorithm

- Batteries are arranged in rows with maximum 100ft width constraint
- Greedy algorithm places largest batteries first for optimal space utilization
- A gap of 2ft between batteries ensures visual clarity between devices

### State Management

- React Context API for global configuration state
- Local state for UI-specific interactions
- Firebase for persistent cloud storage

### User Experience

- Real-time feedback on all interactions
- Toast notifications for important actions
- Accessible components using shadcn
