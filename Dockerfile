FROM ghcr.io/joinmarket-webui/jam-standalone:v0.1.5-clientserver-v0.9.9

# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

RUN sed -i "s|http://|https://|g" /etc/apt/sources.list /etc/apt/sources.list.d/* 
RUN apt-get update && apt-get -y upgrade && apt-get install -y -qq --no-install-recommends wget bash tini
RUN wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${PLATFORM} && chmod +x /usr/local/bin/yq

# USER root

ENV APP_USER "joinmarket"
ENV APP_PASSWORD "joinmarket"
ENV ENSURE_WALLET true

ENV REMOVE_LOCK_FILES true
ENV RESTORE_DEFAULT_CONFIG true

ADD docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD assets/utils/check-api.sh /usr/local/bin/check-api.sh
RUN chmod a+x /usr/local/bin/*.sh
