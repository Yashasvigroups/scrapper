# Use Puppeteer's official base image (includes Chromium + all dependencies)
FROM ghcr.io/puppeteer/puppeteer:22.13.1

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of your code
COPY . .

# Expose the port your API runs on
EXPOSE 3002

# Default command to start your API server
CMD ["npm", "start"]