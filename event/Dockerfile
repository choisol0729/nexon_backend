# ---- Event ----
FROM node:18-alpine
WORKDIR /usr/src/app

COPY event/package.json event/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY event/. .

EXPOSE 3002
CMD ["yarn", "start:dev"]