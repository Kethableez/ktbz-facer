FROM node:16-alpine as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm rebuild bcrypt 


COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm run build

FROM node:16-alpine as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/file/main"]