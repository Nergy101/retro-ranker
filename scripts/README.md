# Scripts

Utility scripts used to manage data and housekeeping tasks. Each file can be
executed with `deno run -A` or through the tasks defined in `deno.json`.

- `generate-devices.ts` – build device data from the source files
- `patch-devices.ts` – apply patches to existing device data
- `get-new-sources.ts` – download new source datasets
- `refresh-all.ts` – run the full refresh pipeline
- `generate-sitemap.ts` – update `static/sitemap.xml`
- `migrate-device-type.ts` – migrate existing devices to include deviceType
  field
- `migrate-device-index.ts` – migrate existing devices to include index field
- `analyze-duplicates.ts` – analyze database for potential duplicate devices (in `data/source/`)
- `merge-duplicate-devices.ts` – merge duplicate devices while preserving user data (in `data/source/`)

## Duplicate Management

See [DUPLICATE_MANAGEMENT.md](../data/source/DUPLICATE_MANAGEMENT.md) for detailed information about managing duplicate devices in the database.
