# !!! Run build in OPEN network !!!
FROM debian:stretch

# Basic Tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
                curl jq openssl sshpass openssh-client \
                ca-certificates apt-transport-https make

# CF CLI
RUN curl -sL -k "https://cli.run.pivotal.io/stable?release=linux64-binary&source=github&version=6.51.0" \
            | tar -zx -C /usr/local/bin/

# MySQL
# If this step fails due to gnupg certificate server error, please try to restart docker
RUN apt-get update && apt-get install -y --no-install-recommends lsb-release gnupg dirmngr wget
RUN mkdir ~/.gnupg && echo "disable-ipv6" >> ~/.gnupg/dirmngr.conf && \
    wget --no-check-certificate https://dev.mysql.com/get/mysql-apt-config_0.8.8-1_all.deb && \
    DEBIAN_FRONTEND=noninteractive dpkg -i mysql-apt-config_0.8.8-1_all.deb && \
    apt-key adv --no-tty --keyserver keys.gnupg.net --recv-keys 8C718D3B5072E1F5 && \
    apt-get update && \
    echo 'mysql-community-server mysql-community-server/root-pass password password' | debconf-set-selections && \
    echo 'mysql-community-server mysql-community-server/re-root-pass password password' | debconf-set-selections && \
    apt-get install -y -q --no-install-recommends \
                    mysql-community-client

# NODEJS
RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    echo 'deb https://deb.nodesource.com/node_12.x stretch main' > /etc/apt/sources.list.d/nodesource.list && \
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt-get update && \
    apt-get install -y --no-install-recommends nodejs yarn

# # Expose port for MySQL, start mysql on run
# EXPOSE 3306
# CMD ["mysqld"]
