# ---- Gateway ----
FROM node:18-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["yarn", "start:dev"]