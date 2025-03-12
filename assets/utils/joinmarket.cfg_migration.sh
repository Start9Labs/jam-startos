#!/bin/bash

cd /root/.joinmarket
jmconfig="joinmarket.cfg"
jmconfig2="${jmconfig}.pre-v0.3.0~1.cfg"
cp $jmconfig $jmconfig2
count=0
for range in $(awk '/IRC SERVER/ { if (found) printf "%d,%d\n", start, NR-1; start = NR; found = 1;} /socks5_port = / { if (found) { printf "%d,%d\n", start, NR+1; found = 0;}} END { if (found) printf "%d,%d\n", start, NR; }' $jmconfig) ; do
 count=$(expr $count + 1)
 if [[ $count -eq 1 ]] ; then
  range0="1,$(expr $(echo $range|cut -d',' -f1) - 1)"
  range0_contents=$(sed -n "${range0}p" $jmconfig)
  #Comment out server1: Darkscience IRC [See: https://github.com/JoinMarket-Org/joinmarket-clientserver/issues/1760 ]
  range1_contents=$(cat $jmconfig | sed "$range s/^\s*#*/#/")
 elif [[ $count -eq 2 ]] ; then
  range2_contents=$(sed -n "${range}p" $jmconfig) 
 elif [[ $count -eq 3 ]] ; then
  #Uncomment server3: hackint
  range3_contents=$(sed "$range s/^\s*#//;$range s/\(^ .*\)/#\1/g;$range s/^# \(channel = .*\)/\1/" $jmconfig)
  rangeend="$(expr $(echo $range|cut -d',' -f2) + 1),$(wc -l $jmconfig))"
  rangeend_contents=$(sed -n "${range}p" $jmconfig)
 fi
done
echo -e "$range0_contents\n$range1_contents\n$range2_contents\n$range3_contents\n$rangeend_contents" > $jmconfig2
