# Fase 1: Construcción de la aplicación
FROM node:21-alpine3.18 AS builder

WORKDIR /usr/src

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

RUN npm run build

# Fase 2: Imagen final de producción
FROM node:21-alpine3.18

WORKDIR /usr/src

COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/prod.env ./prod.env
COPY --from=builder /usr/src/package.json ./package.json

EXPOSE 8080

CMD ["npm", "run", "start:prod"]