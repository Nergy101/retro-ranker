# Performance Logging Implementation

## Overview

Comprehensive performance logging has been added to identify bottlenecks causing 36-second page loads in the Retro Ranker application.

## What Was Added

### 1. Middleware Logging (`routes/_middleware.ts`)

- **Timing breakdown** for each middleware operation
- **Service loading times** (translations, PocketBase)
- **User authentication timing**
- **Route handler execution time**
- **Total middleware processing time**

### 2. Devices Page Handler Logging (`routes/devices/index.tsx`)

- **DeviceService instantiation timing**
- **Tag processing timing**
- **Database queries for devices with tags**
- **PocketBase superuser service creation**
- **Likes and favorites data retrieval**
- **Available tags processing**
- **Complete breakdown of all operations**

### 3. DeviceService Logging (`data/frontend/services/devices/device.service.ts`)

- **Cache hit/miss logging** for devices and tags
- **Database fetch timing** for each operation
- **getDevicesWithTags method timing** with filter and sort details
- **Instance creation and retrieval timing**

### 4. PocketBase Service Logging (`data/pocketbase/pocketbase.service.ts`)

- **getAll method timing** with collection, filter, and result details
- **getUser method timing** for authentication
- **createSuperUserPocketBaseService timing**
- **Error logging with timing information**

### 5. Translation Service Logging (`data/frontend/services/i18n/i18n.service.ts`)

- **Translation file loading timing** (fetch + parse)
- **Cache hit/miss logging**
- **Fallback language loading timing**

## How to Use

### 1. Start the Application

```bash
deno task start
```

### 2. Monitor Logs

The logs will appear in your console with detailed timing information. Look for:

- **⏱️ Performance logs** - Timing information for operations
- **❌ Error logs** - Any errors with timing context
- **⚠️ Warning logs** - Performance warnings
- **✅ Success logs** - Successful operations

### 3. Key Metrics to Watch

#### Middleware Performance

- `translationsTime` - Time to load translation files
- `pocketbaseTime` - Time to create PocketBase service
- `authTime` - User authentication time
- `routeHandlerTime` - Time spent in the actual route handler
- `totalMiddlewareTime` - Total middleware processing time

#### Database Performance

- `dbTime` - Actual database query time
- `resultCount` - Number of records returned
- `filterString` - The actual database filter being used
- `sortString` - The sorting applied to the query

#### Cache Performance

- `cacheAge` - How old the cached data is
- `cacheHit` vs `cacheMiss` - Whether data came from cache or database

### 4. Expected Performance Targets

- **Middleware total time**: < 100ms
- **Database queries**: < 500ms each
- **Translation loading**: < 50ms (cached), < 200ms (first load)
- **DeviceService operations**: < 100ms (cached), < 1000ms (database)
- **Total page load**: < 2000ms

## Identifying Bottlenecks

### 1. Database Queries

Look for logs with high `dbTime` values:

```json
{
  "level": "info",
  "message": "PocketBase getAll - Completed",
  "dbTime": "5000.00ms", // ⚠️ This is very slow!
  "collection": "devices",
  "resultCount": 150
}
```

### 2. Cache Misses

Look for frequent cache misses:

```json
{
  "level": "info",
  "message": "getAllDevices - Cache Miss, Fetching from DB",
  "cacheAge": "300000.00ms" // 5 minutes - cache expired
}
```

### 3. Translation Loading

Look for slow translation loads:

```json
{
  "level": "info",
  "message": "Translation file loaded",
  "fetchTime": "2000.00ms", // ⚠️ Slow network request
  "parseTime": "50.00ms"
}
```

### 4. Authentication Issues

Look for slow authentication:

```json
{
  "level": "info",
  "message": "User Authentication",
  "authTime": "3000.00ms" // ⚠️ Very slow auth
}
```

## Common Issues and Solutions

### 1. Slow Database Queries

**Symptoms**: High `dbTime` values
**Solutions**:

- Add database indexes on frequently queried fields
- Optimize filter strings
- Implement query result caching
- Consider pagination for large result sets

### 2. Cache Expiration

**Symptoms**: Frequent cache misses with high `cacheAge`
**Solutions**:

- Increase cache duration
- Implement background cache refresh
- Use stale-while-revalidate caching strategy

### 3. Network Issues

**Symptoms**: High `fetchTime` for translations or API calls
**Solutions**:

- Use CDN for static assets
- Implement service worker caching
- Consider server-side rendering for critical pages

### 4. Authentication Bottlenecks

**Symptoms**: High `authTime` values
**Solutions**:

- Implement session caching
- Use JWT tokens instead of database lookups
- Consider stateless authentication

## Next Steps

1. **Run the application** and monitor the logs
2. **Identify the slowest operations** from the timing data
3. **Focus optimization efforts** on the bottlenecks
4. **Implement caching strategies** where appropriate
5. **Consider database optimization** if queries are slow
6. **Monitor performance** after each optimization

## Example Log Output

When you load `/devices`, you should see logs like:

```
⏱️ {"level":"info","message":"Page Visit Started","path":"/devices","timestamp":"2024-01-01T12:00:00.000Z"}
⏱️ {"level":"info","message":"Middleware Services Loaded","translationsTime":"45.23ms","pocketbaseTime":"12.34ms"}
⏱️ {"level":"info","message":"Route Handler Completed","routeHandlerTime":"1500.45ms","totalMiddlewareTime":"1557.89ms"}
⏱️ {"level":"info","message":"Devices Page Handler Started","path":"/devices"}
⏱️ {"level":"info","message":"DeviceService Instance Created","deviceServiceTime":"25.67ms"}
⏱️ {"level":"info","message":"getDevicesWithTags - Completed","dbTime":"1200.34ms","resultCount":150}
```

This will help you identify exactly where the 36-second delay is occurring.
