FROM debian:stretch

RUN apt-get update && apt-get install -y --no-install-recommends curl gnupg apt-transport-https

RUN curl -skL "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" \
            | tar -zx -C /usr/local/bin/

RUN curl -skS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update || true && \
    apt-get install -y yarn
