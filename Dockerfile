FROM node:20-slim

# Install Chromium and dependencies for Remotion
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 \
  libcups2 libdbus-1-3 libdrm2 libgbm1 libgtk-3-0 libnspr4 \
  libnss3 libwayland-client0 libxcomposite1 libxdamage1 libxfixes3 \
  libxkbcommon0 libxrandr2 libxss1 libxtst6 xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Remotion needs Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV TEMP=/tmp TMP=/tmp

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build (if you have a build step)
# RUN npm run build

# Default command - override in Cloud Build/Run
CMD ["npm", "run", "render"]