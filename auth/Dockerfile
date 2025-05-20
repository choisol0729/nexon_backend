# ---- Auth ----
FROM node:18-alpine
WORKDIR /usr/src/app

COPY auth/package.json auth/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY auth/. .

EXPOSE 3001
CMD ["yarn", "start:dev"]