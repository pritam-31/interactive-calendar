# 🗓️ Interactive Calendar Component

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![License](https://img.shields.io/badge/license-MIT-green)

A beautiful, production-ready interactive calendar component built with React/Next.js that combines elegant wall calendar aesthetics with powerful date selection and intelligent note-taking capabilities.

![Calendar Screenshot]

## ✨ Features at a Glance

### Core Requirements ✅
- **Wall Calendar Aesthetic** - Stunning hero images that change with seasons, creating an authentic physical calendar feel
- **Intuitive Date Range Selection** - Simple click-to-select start and end dates with beautiful visual highlighting
- **Smart Notes System** - Persistent notes with three flexible modes (monthly, date range, specific date)
- **Fully Responsive Design** - Perfect experience from 4K desktop to mobile devices

### Creative Enhancements 🎨
- 🖼️ **Seasonal Image Carousel** - Dynamic hero images that reflect current month/season with manual navigation
- 📅 **Quick Year Picker** - Popup year selector for rapid navigation across years
- 🎉 **Holiday Detection** - Automatic holiday markers with emoji indicators and tooltips
- 📝 **Quick Notes Templates** - 8 pre-defined templates for common events (meetings, birthdays, deadlines)
- 📊 **Real-time Range Counter** - Instantly shows total days selected
- 🎯 **Today Marker** - Visual indicator for current date
- 💾 **Auto-Save** - Notes automatically persist in browser localStorage
- 🎭 **Three Note Types** - Organize notes by month, date range, or specific dates
- 🌈 **Modern Gradient UI** - Beautiful gradients and smooth animations
- 🎨 **Theme Selector** - Manual theme switching for hero images

## 🚀 Quick Start Guide

### Prerequisites
```bash
Node.js 18.0 or higher
npm / yarn / pnpm / bun

### File-Structure

interactive-calendar/
│
├── components/               # Reusable React components
│   ├── Calendar.jsx         # 🗓️ Main calendar orchestrator
│   ├── HeroImage.jsx        # 🖼️ Seasonal image with carousel
│   ├── NotesSection.jsx     # 📝 Notes management system
│   └── DateRangeSelector.jsx # 📅 Range selection controls
│
├── hooks/                   # Custom React hooks
│   └── useDateRange.js      # 🎣 Date range selection logic
│
├── utils/                   # Utility functions
│   └── calendarHelpers.js   # 🛠️ 30+ date manipulation helpers
│
├── styles/                  # Styling
│   └── globals.css          # 🎨 Global styles & responsive design
│
├── pages/                   # Next.js pages
│   └── index.jsx           # 📄 Main application entry
│
├── public/                  # Static assets
│   └── images/             # 🖼️ Placeholder images (add your own)
│
├── package.json            # 📦 Dependencies & scripts
└── README.md               # 📚 Documentation