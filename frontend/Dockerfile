FROM node:18-alpine AS build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Serve via nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy built assets
COPY --from=build /app/dist ./

# Custom nginx config to support SPA routing and /api proxy (when used in production)
COPY infra/nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

