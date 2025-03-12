FROM ghcr.io/joinmarket-webui/jam-standalone:v0.3.0-clientserver-v0.9.11

# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

RUN sed -i "s|http://|https://|g" /etc/apt/sources.list /etc/apt/sources.list.d/*
RUN apt-get update && apt-get -qqy upgrade && apt-get install -qqy --no-install-recommends wget bash tini && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*

RUN wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${PLATFORM} && chmod +x /usr/local/bin/yq

#Stop using darkscience IRC at their request
# https://github.com/JoinMarket-Org/joinmarket-clientserver/issues/1760
# ...and start using hackint as the secondary, in the default joinmarket config (which is copied to ~/.joinmarket/joinmarket.cfg if it doesn't exist, at startup):
RUN sed -i '94,110 s/^\s*#*/#/;126,127 s/^\s*#\s*//;134,139 s/^\s*#//' /root/default.cfg

# USER root

ENV APP_USER="joinmarket"
ENV ENSURE_WALLET=true

ENV REMOVE_LOCK_FILES=true
ENV RESTORE_DEFAULT_CONFIG=false

ADD docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD assets/utils/check-api.sh /usr/local/bin/check-api.sh
Add assets/utils/joinmarket.cfg_migration.sh /usr/local/bin/joinmarket.cfg_migration.sh
RUN chmod a+x /usr/local/bin/*.sh
