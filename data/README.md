# Data

Data models and utilities for working with device information. Important
subdirectories include:

- `entities/` – TypeScript interfaces representing our data models
- `source/` – scripts and helpers that parse raw files into PocketBase
- `pocketbase/` – local PocketBase instance used during development
- `cap/`, `frontend/`, `pkce/`, `tracing/` – auxiliary data used by the
  application

Large result files under `source/results` and downloads in `source/files`
are not tracked by version control.
