FROM node:alpine

run apk add curl
run apk add dpkg
RUN curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.13.0-amd64.deb && \
    dpkg -i filebeat-7.13.0-amd64.deb

COPY filebeat.yml /etc/filebeat/filebeat.yml
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]


RUN mkdir -p usr/app

WORKDIR /usr/app

COPY package.json ./
RUN npm install
COPY . .

EXPOSE 3333

CMD ["npm run dev"]