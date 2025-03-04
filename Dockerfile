FROM denoland/deno:2.2.2

# Set working directory
WORKDIR /app

# Set a fixed cache directory inside the container
ENV DENO_DIR=/deno_cache

# Copy dependencies definition files first to leverage Docker cache
COPY deno.json* ./


# Copy the rest of the application
COPY . .

# Cache dependencies at build time
RUN deno cache main.ts
RUN deno task build

# Expose any required ports (if needed)
EXPOSE 8000

# Run the application without re-downloading dependencies
CMD ["run", "-A", "main.ts"]


# Usage notes:
# docker build -t retroranker:latest .
# docker run -p 8000:8000 retroranker:latest

### tag as ...:retroranker:latest
### push to docker hub

# docker build -t retroranker:latest .
# docker tag retroranker:latest nergy101/retroranker:latest
# docker push nergy101/retroranker:latest


