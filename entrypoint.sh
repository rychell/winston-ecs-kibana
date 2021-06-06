#!/bin/sh
filebeat setup
service filebeat start
node src/index.js