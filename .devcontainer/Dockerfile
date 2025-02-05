FROM denoland/deno:2.1.9

# Ensure the user exists and explicitly create the home directory
RUN id -u deno &>/dev/null || useradd -m -u 1000 -s /bin/bash deno \
    && mkdir -p /home/deno \
    && chown -R deno:deno /home/deno

# Switch to the 'deno' user
USER deno

WORKDIR /home/deno/app
