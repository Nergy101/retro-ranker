# Device Duplicate Management

This document explains how to handle duplicate devices in the retro-ranker
database.

## The Problem

When device names change slightly (e.g., "RG35XX Pro" vs "RG-35XX Pro"), the
sanitized versions become different ("rg35xx-pro" vs "rg-35xx-pro"), creating
different device IDs. This results in duplicate entries for the same physical
device, with user data (likes, favorites, comments, reviews) split across
multiple records.

## The Solution

We've created two scripts to detect and merge duplicate devices:

### 1. `analyze-duplicates.ts` - Analysis Only

This script analyzes the database and identifies potential duplicate devices
without making any changes.

```bash
deno run --allow-net --allow-read --allow-env data/source/analyze-duplicates.ts
```

**What it does:**

- Scans all devices in the database
- Identifies potential duplicates using fuzzy string matching
- Shows similarity scores and reasoning
- Displays user data counts for each duplicate pair
- Suggests which device should be kept as the primary one

**Output example:**

```
📊 Potential Duplicate Pairs:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Anbernic - RG35XX Pro vs RG-35XX Pro
  IDs: rg35xx-pro vs rg-35xx-pro
  Reason: Same pattern, different formatting
  Similarity: 95%
  Device 1 user data: 5L 2F 1C 0R (8 total)
  Device 2 user data: 3L 1F 0C 0R (4 total)
  💡 Suggested primary: RG35XX Pro (more user data)
  💡 Would merge into: RG-35XX Pro
```

### 2. `merge-duplicate-devices.ts` - Merge Duplicates

This script actually merges the duplicate devices while preserving all user
data.

**Dry Run (Safe - No Changes):**

```bash
deno run --allow-net --allow-read --allow-env data/source/merge-duplicate-devices.ts
```

**Execute (Makes Changes):**

```bash
deno run --allow-net --allow-read --allow-env data/source/merge-duplicate-devices.ts --execute
```

**What it does:**

- Identifies duplicate groups using the same logic as the analysis script
- Selects the best device as the primary (highest rating, most recent, most
  complete data)
- Updates all user data (likes, favorites, comments, reviews) to point to the
  primary device
- Deletes the duplicate devices
- Provides detailed logging of all operations

## Integration with Refresh Process

The duplicate analysis is automatically run as the final step in the
`refresh-all.ts` script. This ensures that after each data refresh, you're aware
of any new duplicates that may have been introduced.

## Duplicate Detection Logic

The scripts use several criteria to identify duplicates:

1. **Same Brand**: Devices must have the same brand to be considered duplicates
2. **Name Similarity**: Uses Levenshtein distance to calculate string similarity
3. **Normalization**: Removes all non-alphanumeric characters for comparison
4. **Pattern Matching**: Detects common patterns like "rg35xx-pro" vs
   "rg-35xx-pro"

**Thresholds:**

- 100% similarity after normalization = Exact duplicate
- 85%+ similarity = High confidence duplicate
- Same pattern after formatting = Pattern-based duplicate

## Primary Device Selection

When merging duplicates, the script selects the primary device based on:

1. **Higher Rating**: Device with better total rating
2. **More Recent**: Device with more recent update/creation date
3. **More Complete**: Device with more complete data (longer names, more fields)
4. **Alphabetical**: As a final tiebreaker

## User Data Preservation

All user data is preserved during the merge process:

- **Likes**: All like records are updated to point to the primary device
- **Favorites**: All favorite records are updated to point to the primary device
- **Comments**: All comment records are updated to point to the primary device
- **Reviews**: All review records are updated to point to the primary device

## Safety Features

- **Dry Run Mode**: Default mode shows what would be done without making changes
- **Detailed Logging**: All operations are logged with clear success/error
  messages
- **User Data Counts**: Shows exactly how much user data will be affected
- **Confirmation**: Execute mode requires explicit `--execute` flag

## Best Practices

1. **Always run analysis first**: Use `analyze-duplicates.ts` to see what
   duplicates exist
2. **Review the results**: Check the suggested merges before executing
3. **Use dry run**: Always test with dry run mode first
4. **Backup first**: Consider backing up your database before running merges
5. **Monitor after merge**: Check that user data is properly preserved

## Example Workflow

```bash
# 1. Analyze current duplicates
deno run --allow-net --allow-read --allow-env data/source/analyze-duplicates.ts

# 2. Review the output and decide which merges to perform

# 3. Test the merge (dry run)
deno run --allow-net --allow-read --allow-env data/source/merge-duplicate-devices.ts

# 4. Execute the merge if satisfied with the dry run results
deno run --allow-net --allow-read --allow-env data/source/merge-duplicate-devices.ts --execute

# 5. Verify the results
deno run --allow-net --allow-read --allow-env data/source/analyze-duplicates.ts
```

## Troubleshooting

**Script fails to connect to PocketBase:**

- Check that your `.env` file has the correct PocketBase credentials
- Ensure PocketBase is running and accessible

**No duplicates found:**

- This is normal if your database is clean
- The script will show "✅ No duplicate devices found!"

**Merge fails:**

- Check the error messages in the console
- Ensure you have proper permissions to modify the database
- Consider running the analysis script again to see current state
