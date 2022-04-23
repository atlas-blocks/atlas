FROM node:17.1.0-alpine3.12 AS dev
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development
EXPOSE 3000
CMD [ "yarn", "dev" ]

FROM node:17.1.0-alpine3.12 AS dependencies
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./ 
RUN npm ci

FROM node:17.1.0-alpine3.12 AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:17.1.0-alpine3.12 AS prod
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production
COPY --chown=node --from=builder /app/next.config.js ./
COPY --chown=node --from=builder /app/public ./public
COPY --chown=node --from=builder /app/.next ./.next
COPY --chown=node --from=builder /app/package-lock.json /app/package.json ./
COPY --chown=node --from=dependencies /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD [ "yarn", "start" ]
