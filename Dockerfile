# 1. Install dependencies only when needed 
FROM node:18-alpine AS builder

LABEL fly_launch_runtime="nodejs"

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* ./
RUN \
    if [ -f yarn.lock ]; then yarn; \
    elif [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

COPY . .
# This will do the trick, use the corresponding env file for each environment.
# COPY .env.production.sample .env.production
COPY .env.sample .env
RUN yarn build

# 3. Install dependencies production only
FROM node:18-alpine AS prod_deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* ./
RUN \
    if [ -f yarn.lock ]; then yarn --prod; \
    elif [ -f package-lock.json ]; then npm install -omit=dev; \
    else echo "Lockfile not found." && exit 1; \
    fi

# 3. Production image, copy all the files and run next
FROM node:18-alpine

LABEL fly_launch_runtime="nodejs"

USER 1001

WORKDIR /app

ENV NODE_ENV production
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --chown=1001:1001 --from=builder /app/server.js ./server.js
COPY --chown=1001:1001 --from=builder /app/package.json ./package.json
COPY --chown=1001:1001 --from=builder /app/astro.config.mjs ./astro.config.mjs
COPY --chown=1001:1001 --from=builder /app/dist ./dist
COPY --chown=1001:1001 --from=builder /app/public ./public
COPY --chown=1001:1001 --from=prod_deps /app/node_modules ./node_modules
COPY .env.sample .env

EXPOSE 3000

CMD ["node", "server.js"]
