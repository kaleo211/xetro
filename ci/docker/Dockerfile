FROM debian:stretch

RUN apt-get update && apt-get install -y --no-install-recommends curl && \
    curl -sL "https://packages.cloudfoundry.org/stable?release=linux64-binary" | tar -zx && \
    mv cf /usr/local/bin
