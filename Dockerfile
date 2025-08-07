FROM denoland/deno:alpine

# Set working directory
WORKDIR /app

# Set a fixed cache directory inside the container
ENV DENO_DIR=/deno_cache
ENV DENO_ENV=production

RUN deno install

# Copy dependencies definition files first to leverage Docker cache
COPY deno.json* ./

# Copy the rest of the application
COPY . .

# Cache dependencies at build time
# RUN deno cache main.ts
# RUN deno run -A dev.ts build

# Expose any required ports (if needed)
EXPOSE 8000

# Run the application without re-downloading dependencies
CMD ["run", "prod"]

### Usage notes:
# docker build -t retro-ranker:latest .
# docker compose up

### tag as ...:retro-ranker:latest
### push to docker hub:
# docker tag retro-ranker:latest nergy101/retro-ranker:latest
# docker push nergy101/retro-ranker:latest

## all of the above in one go:
# docker build -t retro-ranker:latest . && docker tag retro-ranker:latest nergy101/retro-ranker:latest && docker push nergy101/retro-ranker:latest
