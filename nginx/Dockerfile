# Step 1: Build the frontend application
FROM node:22.17.1-alpine AS build-stage

WORKDIR /app-frontend

COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci

COPY frontend/ .

COPY frontend/.env.production .

RUN npm run build

# Stage 2
FROM nginx:stable-alpine3.23

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build-stage /app-frontend/dist /usr/share/nginx/html/

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
