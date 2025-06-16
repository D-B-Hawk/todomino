# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.16-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /todomino
EXPOSE 3000

FROM base AS development
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
    
RUN apk add git openssh-client 

FROM base AS test
ENV NODE_ENV=test

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY . .
RUN npm run test