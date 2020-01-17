FROM debian:stretch

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
              curl gnupg apt-transport-https software-properties-common

RUN echo "Acquire::https::Verify-Peer \"false\";" | tee /etc/apt/apt.conf.d/insecure && \
    echo "Acquire::https::Verify-Host \"false\";" | tee -a /etc/apt/apt.conf.d/insecure

RUN curl -sL -k "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github&version=6.37.0" \
            | tar -zx -C /usr/local/bin/

RUN curl -skL "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github" \
            | tar -zx -C /usr/local/bin/

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs

RUN curl -skS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn
