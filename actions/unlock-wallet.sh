#!/bin/sh

set -e

count=`find /root/.joinmarket/wallets -type f -iname ".*.jmdat.lock" | wc -l`
if [ $count != 0 ]
then
    rm -rf /root/.joinmarket/wallets/.*.jmdat.lock
    export action_result_running="    {
        \"version\": \"0\",
        \"message\": \"All wallets unlocked.\",
        \"value\": null,
        \"copyable\": false,
        \"qr\": false
    }" >/dev/null && echo $action_result_running
else
    export action_result_error="    {
        \"version\": \"0\",
        \"message\": \"No locked wallets found.\",
        \"value\": null,
        \"copyable\": false,
        \"qr\": false
    }" >/dev/null && echo $action_result_error
fi