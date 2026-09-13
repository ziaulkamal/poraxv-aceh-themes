# syntax=docker/dockerfile:1.7
###############################################################################
# WEB — PoraAcehJaya-FE (React 19 / Vite) — SPA statis disajikan Nginx
###############################################################################

# ---- Stage 1: build ----
FROM node:20-alpine AS build
WORKDIR /app

# Vite meng-inline VITE_* SAAT BUILD → URL backend ditentukan di sini.
ARG VITE_CMS_API_URL
ARG VITE_CMS_WS_URL
ARG VITE_SIMPORA_API_URL
ARG VITE_SIMPORA_ICON_BASE
ENV VITE_CMS_API_URL=$VITE_CMS_API_URL \
    VITE_CMS_WS_URL=$VITE_CMS_WS_URL \
    VITE_SIMPORA_API_URL=$VITE_SIMPORA_API_URL \
    VITE_SIMPORA_ICON_BASE=$VITE_SIMPORA_ICON_BASE

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---- Stage 2: runtime (Nginx statis) ----
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
