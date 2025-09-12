FROM denoland/deno:2.4.5

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno task build
RUN deno cache _fresh/server.js

EXPOSE 8000

CMD ["serve", "-A", "_fresh/server.js"]

# docker build --build-arg GIT_REVISION=$(git rev-parse HEAD) -t retro-ranker .
# docker run -t -i -p 8000:8000 retro-ranker

# docker build -t retro-ranker:latest . && docker tag retro-ranker:latest nergy101/retro-ranker:latest && docker push nergy101/retro-ranker:latest
