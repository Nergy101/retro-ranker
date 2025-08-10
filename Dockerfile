FROM denoland/deno:alpine

# Set working directory
WORKDIR /app

# Environment
ENV DENO_DIR=/deno_cache
ENV DENO_ENV=production

# Copy dependency metadata first (better layer caching)
COPY deno.json* ./
COPY deno.lock ./deno.lock

# Pre-cache deps used by build/runtime to reduce peak RAM during container start
RUN deno cache main.ts dev.ts || true

# Copy the full application
COPY . .

# Build Fresh assets at image build time (avoid building at container runtime)
RUN deno task build

# Expose port
EXPOSE 8000

# Run with a conservative V8 heap cap to avoid OOM on small VPS
# Adjust --max-old-space-size (in MB) to fit your host (e.g. 384, 512, 768)
CMD ["run", "-A", "--v8-flags=--max-old-space-size=512", "main.ts"]

### Usage notes:
# docker build -t retro-ranker:latest .
# docker compose up

### tag as ...:retro-ranker:latest
### push to docker hub:
# docker tag retro-ranker:latest nergy101/retro-ranker:latest
# docker push nergy101/retro-ranker:latest

## all of the above in one go:
# docker build -t retro-ranker:latest . && docker tag retro-ranker:latest nergy101/retro-ranker:latest && docker push nergy101/retro-ranker:latest
