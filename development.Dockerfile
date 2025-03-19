FROM node:22-alpine3.18

COPY ["./package.json", "./package-lock.json", "/usr/src/"]

WORKDIR /usr/src

COPY ["./", "/usr/src/"]

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start:dev"]