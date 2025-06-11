# Retro Ranker 🎮

![Retro Ranker](https://retroranker.site/images/rr-star.png)

## Overview

Retro Ranker is a comprehensive comparison tool for retro handheld gaming
devices that helps enthusiasts make informed purchase decisions. Our database
provides detailed specifications, performance metrics, and side-by-side
comparisons of the latest handhelds.

**[Visit Retro Ranker](https://retroranker.site)**

## ✨ Features

- **Comprehensive Database**: Detailed technical specifications for popular
  retro gaming handhelds
- **Performance Analysis**: Accurate ratings and emulation capabilities for
  different systems
- **Compare Tool**: Side-by-side device comparisons to find your perfect
  handheld
- **Real Performance Metrics**: Actual gameplay benchmarks rather than just
  specs
- **Price Tracking**: Current pricing from major retailers
- **Advanced Search**: Filter devices by capabilities, price range, and features
- **Modern UI**: Clean, accessible interface with dark mode support
- **Mobile-Friendly**: Responsive design works on all your devices
- **Leaderboard**: Community-driven leaderboard of top-rated handhelds
- **Charts & Analytics**: Interactive charts and data visualizations for brands,
  ratings, release trends, and more
- **Release Timeline**: Chronological timeline of handheld releases and upcoming
  devices
- **Device Reviews**: Users can leave and browse reviews for each device
- **Device Likes & Favorites**: Like and favorite devices to curate your own
  list and influence rankings
- **Device Comments**: Comment on devices and join the discussion
- **User Collections**: Maintain and showcase your own collection of handhelds
- **SSO Authentication**: Sign in with Discord or Google, in addition to
  email/password
- **User Profiles**: View and manage your reviews, comments, likes, favorites,
  and collections
- **Community Features**: Engage with other users through comments, reviews, and
  leaderboards

## 🚀 Current State & Roadmap

- [x] Search devices
  - [x] Filter devices
  - [x] Filter devices on multiple tags and a searchfield
- [x] User accounts
  - [x] Non-SSO sign-up & log-in (using Pocketbase)
  - [x] SSO (Discord, Google)
- [x] Community Handheld leaderboards
  - [x] Liking devices
  - [x] Leaving comments on devices
  - [x] Leaving reviews on devices
- [x] Maintaining and showcasing (your own) collections of handhelds
  - [ ] More properties and data to add
- [x] Device favorites (curate your own favorite list)
- [x] Release timeline (historical & upcoming)
- [x] Charts & analytics (brand, rating, release trends, etc.)
  - [ ] More charts to come!
- [x] Device comparisons
- [x] User profiles (manage your activity)
- [ ] Manual moderation step for device data
- [ ] More features to come!

[Or see the trello board here.](https://trello.com/invite/b/678ef0a0da4f850675889b50/ATTIc9374d330560a0a058af22a41386dff245955816/retroranker)

## 🛠️ Tech Stack

- **[Deno](https://deno.land/)**: Secure JavaScript/TypeScript runtime
- **[Fresh](https://fresh.deno.dev/)**: Modern web framework for Deno
- **[Deno Deploy](https://deno.com/deploy)**: Serverless deployment platform
- **[PicoCSS](https://picocss.com/)**: Lightweight, semantic CSS framework

## 🚀 Development

### Prerequisites

- [Deno](https://deno.land/manual/getting_started/installation)
- Git

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Nergy101/retro-ranker.git
cd retro-ranker

# Start the development server
deno task start

# Format, lint and type-check code
deno task check
```

#### Environment Setup

Copy the sample environment file and adjust the values:

```bash
cp .env.example .env
```

Environment variables in `.env`:

- `BASE_API_URL` – Base URL for the API.
- `POCKETBASE_URL` – Address of your PocketBase instance.
- `POCKETBASE_SUPERUSER_EMAIL` – PocketBase superuser email.
- `POCKETBASE_SUPERUSER_PASSWORD` – Password for the superuser account.
- `OTEL_*` – OpenTelemetry settings (`OTEL_DENO`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`).

Refer to `.env.defaults` for example values used with local `docker-compose`.

### Available Tasks

#### Development Tasks

- `deno task start` - Run development server with hot reload
- `deno task dev` - Clean and start development server
- `deno task build` - Build for production
- `deno task preview` - Preview production build
- `deno task deploy` - Build and deploy to Deno Deploy

#### Code Quality Tasks

- `deno task check` - Run all code quality checks (format, lint, type-check)
- `deno fmt` - Format code
- `deno lint` - Run linter

#### Data Management Tasks

- `deno task refresh-all` - Refresh all data sources
- `deno task sources` - Update data sources
- `deno task generate-devices` - Generate device data
- `deno task patch-devices` - Patch device data
- `deno task scrape` - Scrape device images
- `deno task sitemap` - Generate sitemap.xml

### Development Workflow

1. Start development:

   ```bash
   deno task dev
   ```

2. Before committing changes:

   ```bash
   deno task validate
   ```

3. For production deployment:

   ```bash
   deno task prod
   ```

4. To update dependencies:
   ```bash
   deno task update-deps
   ```

### Project Structure

```
retro-ranker/
├── components/ # Reusable UI components
├── data/       # Data models and services
├── islands/    # Interactive client-side components
├── routes/     # Page components and API endpoints
├── scripts/    # Utility scripts
├── static/     # Static assets (images, styles)
└── main.ts     # Application entry point
```

### Directory Guide

- [`components/`](components/README.md) – reusable UI pieces
- [`islands/`](islands/README.md) – client-side interactive components
- [`routes/`](routes/README.md) – pages and API endpoints
- [`scripts/`](scripts/README.md) – helper scripts for data management
- [`data/`](data/README.md) – data models and source helpers
- [`static/`](static/README.md) – images, icons and other static assets

## 🐳 Docker

Build the container image and run the project via Docker Compose.

1. Build the image:

   ```bash
   docker build -t retro-ranker .
   ```

2. Start the services:

   ```bash
   docker compose up
   ```

The `.env` file is read by `docker-compose` to configure the services. You can
copy `.env.example` to `.env` and adjust the settings before running Docker.

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. Push to your branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for
details.

## 🙏 Acknowledgments

- ## Data powered by the [Retro Handhelds](https://retro-handhelds.com) community
- Device specifications from:
  [Handheld Overview Datasheet](https://docs.google.com/spreadsheets/d/1irg60f9qsZOkhp0cwOU7Cy4rJQeyusEUzTNQzhoTYTU/edit?gid=0#gid=0)
- Community contributions and feedback

## 📱 Connect With Me

- [GitHub](https://github.com/nergy101)
- [BlueSky](https://bsky.app/profile/nergy101.bsky.social)

## 💝 Support the Project

If you find Retro Ranker helpful, consider:

- [Buying us a coffee](https://ko-fi.com/nergy)
- Contributing to the codebase
- Sharing with fellow retro gaming enthusiasts
