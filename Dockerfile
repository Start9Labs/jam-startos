FROM ghcr.io/joinmarket-webui/joinmarket-webui-standalone:v0.0.10-clientserver-v0.9.6@sha256:12bba3c1761a277a7e642cd0e9c29c97cc73fb697dc8f652a4e57bd2f99d89f3
RUN apt-get update && apt-get install -qq --no-install-recommends wget bash 
RUN wget https://github.com/mikefarah/yq/releases/download/v4.12.2/yq_linux_arm.tar.gz -O - |\
      tar xz && mv yq_linux_arm /usr/bin/yq

USER root

ENV DATADIR /root/.joinmarket
ENV CONFIG ${DATADIR}/joinmarket.cfg
ENV DEFAULT_CONFIG /default.cfg
ENV DEFAULT_AUTO_START /autostart
ENV AUTO_START ${DATADIR}/autostart
ENV JM_RPC_HOST="bitcoind.embassy"
ENV JM_RPC_PORT="8332"
ENV JM_RPC_USER="bitcoin"
ENV JM_RPC_PASSWORD=
ENV APP_USER "joinmarket"
ENV APP_PASSWORD "joinmarket"
ENV JMWEBUI_JMWALLETD_HOST "jam.embassy"
ENV JMWEBUI_JMWALLETD_API_PORT "28183"
ENV JMWEBUI_JMWALLETD_WEBSOCKET_PORT "28283"
ENV ENSURE_WALLET true

ADD jam-docker/standalone/autostart /
ADD jam-docker/standalone/default.cfg /
ADD jam-docker/standalone/torrc /
RUN chmod a+x /autostart
RUN chmod a+x /default.cfg
RUN chmod a+x /torrc

ADD docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD assets/utils/check-web.sh /usr/local/bin/check-web.sh
ADD assets/utils/check-api.sh /usr/local/bin/check-api.sh
ADD actions/unlock-wallet.sh /usr/local/bin/unlock-wallet.sh
RUN chmod a+x /usr/local/bin/*.sh

EXPOSE 80 28183 27183 8080

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]