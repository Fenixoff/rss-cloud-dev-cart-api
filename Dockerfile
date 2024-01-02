FROM node:20-alpine AS build

WORKDIR /app

COPY --chown=node:node package.json package-lock.json ./

RUN npm install

COPY --chown=node:node . .

ENV NODE_ENV production

RUN npm run build -- --webpack


FROM node:20-alpine as prod

WORKDIR /app

ENV NODE_ENV production

USER node

COPY --chown=node:node --from=build /app/dist/main.js .

CMD ["node", "main.js"]
