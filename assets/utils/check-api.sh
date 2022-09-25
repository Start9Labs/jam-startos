#!/bin/bash

DURATION=$(</dev/stdin)
if (($DURATION <= 5000)); then
    echo "JAM Web API may take a while to start, please be patient..."
    exit 60
else
    if ! curl -sSL --silent --fail --insecure https://jam.embassy:28183/api/v1/session &>/dev/null; then
        echo "JAM API is unreachable. please wait" >&2
        exit 61
    fi
fi
