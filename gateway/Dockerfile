# ---- Gateway ----
FROM node:18-alpine
WORKDIR /usr/src/app

# 1 Install dependencies
COPY gateway/package.json gateway/yarn.lock ./
RUN yarn install --frozen-lockfile

# 2 Copy source
COPY gateway/. .

EXPOSE 3000
CMD ["yarn", "start:dev"]