FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app

ARG CONVEX_DEPLOYMENT
ARG CONVEX_DEPLOY_KEY
ARG NEXT_PUBLIC_CONVEX_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG NEXT_PUBLIC_STREAM_API_KEY
ARG STREAM_API_SECRET
ARG NEXT_PUBLIC_DOOM_PASSWORD
ARG EMAIL_PASS
ARG EMAIL_USER
ARG SMTP_SERVER_HOST
ARG SMTP_SERVER_USERNAME
ARG SMTP_SERVER_PASSWORD
ARG SITE_MAIL_SENDER
ARG NEXT_PUBLIC_SITE_URL
ARG UPSTASH_REDIS_REST_URL
ARG UPSTASH_REDIS_REST_TOKEN

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN echo "CONVEX_DEPLOYMENT=$CONVEX_DEPLOYMENT" > .env.local && \
    echo "CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY" >> .env.local && \
    echo "NEXT_PUBLIC_CONVEX_URL=$NEXT_PUBLIC_CONVEX_URL" >> .env.local && \
    echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" >> .env.local && \
    echo "CLERK_SECRET_KEY=$CLERK_SECRET_KEY" >> .env.local && \
    echo "NEXT_PUBLIC_STREAM_API_KEY=$NEXT_PUBLIC_STREAM_API_KEY" >> .env.local && \
    echo "STREAM_API_SECRET=$STREAM_API_SECRET" >> .env.local && \
    echo "NEXT_PUBLIC_DOOM_PASSWORD=$NEXT_PUBLIC_DOOM_PASSWORD" >> .env.local && \
    echo "EMAIL_PASS=$EMAIL_PASS" >> .env.local && \
    echo "EMAIL_USER=$EMAIL_USER" >> .env.local && \
    echo "SMTP_SERVER_HOST=$SMTP_SERVER_HOST" >> .env.local && \
    echo "SMTP_SERVER_USERNAME=$SMTP_SERVER_USERNAME" >> .env.local && \
    echo "SMTP_SERVER_PASSWORD=$SMTP_SERVER_PASSWORD" >> .env.local && \
    echo "SITE_MAIL_SENDER=$SITE_MAIL_SENDER" >> .env.local && \
    echo "NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL" >> .env.local && \
    echo "UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL" >> .env.local && \
    echo "UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN" >> .env.local && \
    npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/convex ./convex

CMD ["npm", "start"]
