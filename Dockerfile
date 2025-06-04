FROM denoland/deno:2.3.5

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

# Accept a build argument for version
# ARG VERSION
# # Write the version to version.txt
# RUN echo "$VERSION" > static/version.txt

# Cache dependencies at build time
RUN deno cache main.ts
# RUN deno task build

# Expose any required ports (if needed)
EXPOSE 8000

# Run the application without re-downloading dependencies
CMD ["run", "-A", "main.ts"]

# Usage notes:
# docker build -t retro-ranker:latest . 
# docker run -p 8000:8000 retro-ranker:latest

### tag as ...:retro-ranker:latest
### push to docker hub

# docker build -t retro-ranker:latest .
# docker compose up

# docker tag retro-ranker:latest nergy101/retro-ranker:latest
# docker push nergy101/retro-ranker:latest

# docker build -t retro-ranker:latest . && docker tag retro-ranker:latest nergy101/retro-ranker:latest && docker push nergy101/retro-ranker:latest
