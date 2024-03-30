FROM node:20.10.0-alpine AS base

######################################################################
#
######################################################################

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
RUN mkdir /app/.yarn

# Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .yarnrc.yml ./
COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn/. ./.yarn/

RUN yarn --immutable --network-timeout 100000;

######################################################################
#
######################################################################

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.build .env

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn --network-timeout 100000 
RUN yarn build

######################################################################
#
######################################################################

# Production image, copy all the files and run next
FROM base AS velero-ui
ARG VERSION
ARG BUILD_DATE

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_FRONT_END_BUILD_VERSION=$VERSION
ENV NEXT_PUBLIC_FRONT_END_BUILD_DATE=$BUILD_DATE

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]