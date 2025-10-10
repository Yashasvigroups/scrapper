# Use Node.js official image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install Puppeteer with Chromium (this will fetch compatible Chrome)
COPY package*.json ./
RUN npm install puppeteer --only=production

# Copy the rest of your source
COPY . .

# Expose API port
EXPOSE 3002

# Start your API server
CMD ["npm", "start"]
