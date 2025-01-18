# Build stage
FROM node:20.18.0-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code and create env files
RUN npm run init:copy && npm run init:compile

# Production stage
FROM node:20.18.0-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm i
RUN npm i -g nodemon

# Copy built files and config files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.cliamrc.js ./.cliamrc.js

# Create necessary directories for uploads and logs
RUN mkdir -p ./dist/public/archives \
    && mkdir -p ./dist/public/documents \
    && mkdir -p ./dist/public/images/master-copy \
    && mkdir -p ./dist/public/images/rescale \
    && mkdir -p ./dist/public/audios \
    && mkdir -p ./dist/public/videos \
    && mkdir -p ./dist/logs

# Set environment variables
ENV NODE_ENV=development
ENV PORT=8101

# Expose the port
EXPOSE 8101

# Start the application
CMD ["nodemon", "."]
