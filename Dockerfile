FROM node:latest

# RUN mkdir -p /usr/src/alter

WORKDIR /usr/src/alter

COPY run-dev.sh /usr/local/bin
COPY ssl ssl
COPY server server
COPY client client

RUN cd server && \
	npm ci --unsafe-perm

RUN cd client && \ 
	npm ci --unsafe-perm

EXPOSE 3000
EXPOSE 8080

CMD /usr/local/bin/run-dev.sh
