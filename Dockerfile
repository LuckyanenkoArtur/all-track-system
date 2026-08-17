# --- Stage 1: build ---
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# --- Stage 2: serve ---
FROM nginxinc/nginx-unprivileged:1.28.2-alpine

USER root
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
USER 101

EXPOSE 8316
