FROM node:20-slim

# Install Chromium + Xvfb + fonts + deps
# RUN apt-get update && apt-get install -y \
#     chromium xvfb \
#     fonts-liberation libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 \
#     libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
#     libgbm1 libasound2 xdg-utils \
#     && rm -rf /var/lib/apt/lists/*

# Set display for Xvfb
# ENV DISPLAY=:99

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
# Start Xvfb before running node
# CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x720x24 & node app.js"]
CMD ["node", "app.js"]