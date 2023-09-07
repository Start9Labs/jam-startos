FROM ghcr.io/joinmarket-webui/jam-standalone:v0.1.5-clientserver-v0.9.9

# arm64 or amd64
ARG PLATFORM
# aarch64 or x86_64
ARG ARCH

USER root

RUN sed -i "s|http://|https://|g" /etc/apt/sources.list /etc/apt/sources.list.d/* 
RUN apt-get update && apt-get upgrade -y --no-install-recommends && apt-get install -y -qq --no-install-recommends wget bash tini sudo curl
RUN wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_${PLATFORM} && chmod +x /usr/local/bin/yq

RUN groupadd -g 701234 jm
RUN useradd -u 7012347 -g 701234 -s /bin/nologin -d /data jm
RUN useradd -u 7012348 -g 701234 -s /bin/nologin -d /data jm-ob

ENV ENSURE_WALLET true
ENV REMOVE_LOCK_FILES true
ENV RESTORE_DEFAULT_CONFIG false

ADD docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD assets/utils/check-api.sh /usr/local/bin/check-api.sh
RUN chmod a+x /usr/local/bin/*.sh

#Run the joinmarket snakes as unprivileged users and ensure correct privileges:
RUN sed -i "s|^command = \(python3 jmwalletd.py\)$|command = sudo -u jm \1|" /etc/dinit.d/jmwalletd
RUN sed -i "s|^command = \(python3 ob-watcher.py --host=127.0.0.1\)$|command = sudo -u jm-ob \1|" /etc/dinit.d/ob-watcher
#make sure the jm user's home directory exists &
#make sure the jm user and jm group can write into the proper joinmarket dirs
RUN sed -i "s|^\(exec /sbin/dinit --container\)$|mkdir -p /data/.joinmarket/\{cmtdata,logs,ssl,wallets\} \&\& chown -R jm:jm /data \&\& chmod 0775 /data/.joinmarket/\{cmtdata,logs,ssl\}\n\1|" /jam-entrypoint.sh
