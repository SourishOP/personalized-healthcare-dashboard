# Backend Dockerfile

# Stage 1: Build (Dependencies)
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Install dependencies (only production)
RUN npm install --only=production

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set permissions
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
