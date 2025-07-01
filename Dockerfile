# Multi-stage build Dockerfile for Vue.js frontend project
# First stage: Build stage
FROM node:22-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build project
RUN npm run build

# Second stage: Production stage
FROM nginx:1.25-alpine AS production-stage

# Remove default nginx static resources
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Create startup script for runtime configuration injection
RUN echo '#!/bin/sh' > /startup.sh && \
    echo 'set -e' >> /startup.sh && \
    echo '' >> /startup.sh && \
    echo '# Replace environment variables in built files' >> /startup.sh && \
    echo 'if [ -n "$VITE_API_BASE_URL" ]; then' >> /startup.sh && \
    echo '  echo "Injecting VITE_API_BASE_URL: $VITE_API_BASE_URL"' >> /startup.sh && \
    echo '  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|http://localhost:8099|$VITE_API_BASE_URL|g" {} \;' >> /startup.sh && \
    echo 'fi' >> /startup.sh && \
    echo '' >> /startup.sh && \
    echo '# Start nginx' >> /startup.sh && \
    echo 'exec nginx -g "daemon off;"' >> /startup.sh && \
    chmod +x /startup.sh

# Expose port
EXPOSE 80

# Use startup script instead of direct nginx
CMD ["/startup.sh"]