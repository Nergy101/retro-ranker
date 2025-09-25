# Retro Ranker 2

A modern, responsive, and feature-rich device catalog website built with Fresh 2
and Deno.

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

<div style="display: flex; align-items: center; gap: 20px; justify-content: center; margin: 20px 0;">
  <img src="./static/images/rr-star.png" alt="Retro Ranker" style="height: 90px; width: auto;" />
  <img src="./static/logos/retro-handhelds/rh-logo-text.png" alt="Retro Handhelds" style="height: 60px; width: auto;" />
  <img src="./static/logos/nergy/nergy-circle-cutout.png" alt="Nergy" style="height: 60px; width: auto;" />
</div>

This is a complete port of the Retro Ranker project from Fresh 2-alpha to Fresh
2-beta, showcasing the new patterns and features available in the latest version
of Fresh.

## 🚀 What's Been Ported

### Core Routes

- **Home Page** (`/`) - Complete with device showcases, popular searches, and
  hero section
- **Devices Page** (`/devices`) - Full device catalog with search, filtering,
  and pagination
- **Device Detail Page** (`/devices/[name]`) - Individual device pages with
  specifications and similar devices
- **FAQ Page** (`/faq`) - Comprehensive FAQ with collapsible sections
- **Release Timeline** (`/release-timeline`) - Chronological timeline of device
  releases

### Key Features Implemented

- ✅ **useSignal & useSignalEffect** - Modern reactive state management
- ✅ **Fresh 2-beta Page Definition** - Using `define.page()` pattern
- ✅ **Responsive Design** - Mobile-first approach with CSS Grid and Flexbox
- ✅ **SEO Optimization** - Proper meta tags and structured data
- ✅ **TypeScript Support** - Full type safety throughout
- ✅ **Component Architecture** - Reusable components with proper interfaces

## 🛠️ Technical Stack

- **Framework**: Fresh 2-beta with Vite
- **Runtime**: Deno
- **UI Library**: Preact with Signals
- **Styling**: Custom CSS with CSS Variables
- **Database**: PocketBase (simplified service layer)
- **TypeScript**: Full type safety

## 📁 Project Structure

```
retro-ranker-2/
├── routes/                    # Page routes
│   ├── index.tsx             # Home page
│   ├── devices/
│   │   ├── index.tsx         # Device catalog
│   │   └── [name].tsx        # Device detail pages
│   ├── faq/
│   │   └── index.tsx         # FAQ page
│   └── release-timeline/
│       └── index.tsx         # Release timeline
├── components/               # Reusable components
│   └── Button.tsx           # Button component
├── data/                     # Data layer
│   ├── frontend/
│   │   ├── contracts/        # Type definitions
│   │   └── services/         # Business logic
│   └── pocketbase/           # Database service
├── interfaces/               # TypeScript interfaces
├── static/                   # Static assets
├── assets/                   # CSS and other assets
└── utils.ts                  # Utility functions
```

## 🎯 Fresh 2-beta Patterns Used

### 1. Page Definition

```tsx
export default define.page(function HomePage(ctx) {
  // Page logic here
});
```

### 2. Signal-based State Management

```tsx
const devices = useSignal<Device[]>([]);
const isLoading = useSignal(true);

useSignalEffect(() => {
  const loadData = async () => {
    // Async data loading
  };
  loadData();
});
```

### 3. SEO Integration

```tsx
ctx.state.seo = {
  title: "Page Title",
  description: "Page description",
  keywords: "relevant, keywords",
};
```

## 🚀 Getting Started

### Prerequisites

- [Deno](https://deno.land/manual/getting_started/installation) 1.40+

### Development

```bash
# Start development server
deno task dev

# Build for production
deno task build

# Start production server
deno task start

# Type check
deno task check
```

## 🔧 Key Improvements Over Fresh 2-alpha

1. **Simplified State Management**: Using `useSignal` and `useSignalEffect`
   instead of complex state management
2. **Better Type Safety**: Improved TypeScript integration with proper
   interfaces
3. **Modern Build System**: Vite integration for faster development and building
4. **Cleaner Architecture**: Simplified component structure and data flow
5. **Performance**: Optimized rendering with Fresh 2-beta's improvements

## 📱 Features

### Device Catalog

- Search and filter devices by multiple criteria
- Multiple layout options (grid 9, grid 4, list)
- Pagination with customizable page sizes
- Tag-based filtering system

### Device Details

- Comprehensive device specifications
- Similar device recommendations
- Vendor links and pricing information
- Responsive image galleries

### Release Timeline

- Chronological device release history
- Visual timeline with device cards
- Filter by release date and category

### FAQ System

- Collapsible question sections
- Comprehensive device and comparison information
- Search-friendly content structure

## 🎨 Styling

The project uses a custom CSS system with:

- CSS Variables for theming
- Responsive design patterns
- Utility classes for common patterns
- Dark mode support via `prefers-color-scheme`

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Device comparison tool
- [ ] User reviews and ratings
- [ ] Advanced search filters
- [ ] Data visualization charts
- [ ] Mobile app integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for
details.

## 🙏 Acknowledgments

- Original Retro Ranker project for inspiration and data structure
- Fresh team for the amazing framework
- Deno team for the excellent runtime
- Preact team for the lightweight React alternative
