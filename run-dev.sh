#!/bin/sh
(cd /usr/src/alter/client && npm run start-dev) | (cd /usr/src/alter/server && npm run start-dev)