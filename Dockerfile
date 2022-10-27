FROM ghcr.io/joinmarket-webui/jam-dev-standalone:master

# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

RUN apt-get update && apt-get install -qq --no-install-recommends wget bash tini
RUN wget https://github.com/mikefarah/yq/releases/download/v4.6.3/yq_linux_${PLATFORM}.tar.gz -O - |\
  tar xz && mv yq_linux_${PLATFORM} /usr/bin/yq

# USER root

ENV APP_USER "joinmarket"
ENV APP_PASSWORD "joinmarket"
ENV ENSURE_WALLET true

ENV REMOVE_LOCK_FILES true
ENV RESTORE_DEFAULT_CONFIG true

ADD docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD assets/utils/check-web.sh /usr/local/bin/check-web.sh
ADD assets/utils/check-api.sh /usr/local/bin/check-api.sh
RUN chmod a+x /usr/local/bin/*.sh
