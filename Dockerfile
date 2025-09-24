FROM denoland/deno:2.4.5

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

# Copy dependency files first for better layer caching
COPY deno.json deno.lock ./

# Cache dependencies - this layer will only rebuild if dependencies change
RUN deno cache deno.json

# Copy the rest of the application code
COPY . .

# Build the application
RUN deno task build

# Cache the server entry point
RUN deno cache _fresh/server.js

EXPOSE 8000

CMD ["serve", "-A", "_fresh/server.js"]

# docker buildx build . -t retro-ranker
# docker run -t -i -p 8000:8000 retro-ranker

# docker build -t retro-ranker:latest . && docker tag retro-ranker:latest nergy101/retro-ranker:latest && docker push nergy101/retro-ranker:latest
