# Use the official Deno 2 image as the base stage
FROM denoland/deno:2.2.2 as builder

# Set the working directory
WORKDIR /app

# Copy dependencies files first for caching
COPY deno.json ./

# Cache and compile dependencies
RUN deno cache main.ts

# Copy the rest of the application
COPY . .

# Compile the application for faster startup
RUN deno task build

# Use a minimal Deno runtime image for production
FROM denoland/deno:2.2.2

# Set the working directory
WORKDIR /app

# Copy the compiled application from the builder stage
COPY --from=builder /app /app

# Set appropriate permissions
RUN chmod -R 755 /app

# Expose the port Fresh runs on
EXPOSE 8000

# Start the application
CMD ["deno", "task", "preview"]




# usage
# docker build -t retroranker:latest .
# docker run -p 8000:8000 retroranker:latest

### tag as ...:retroranker:latest
### push to docker hub

# docker build -t retroranker:latest .
# docker tag retroranker:latest nergy101/retroranker:latest
# docker push nergy101/retroranker:latest


