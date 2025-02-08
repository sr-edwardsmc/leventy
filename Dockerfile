# Use the official Node.js image with a specific architecture
FROM --platform=linux/amd64 node:20
# Install dependencies

# Set working directory
WORKDIR /app

ARG NODE_ENV=production
ARG POSTGRES_PRISMA_URL=postgresql://postgres:password@localhost:5432/postgres
ARG EMAIL_ADDRESS=email@test.com
ARG EMAIL_APP_PASSWORD=password
ARG SESSION_SECRET_KEY=test

ENV NODE_ENV=${NODE_ENV}
ENV POSTGRES_PRISMA_URL=${POSTGRES_PRISMA_URL}
ENV EMAIL_ADDRESS=${EMAIL_ADDRESS}
ENV EMAIL_APP_PASSWORD=${EMAIL_APP_PASSWORD}
ENV SESSION_SECRET_KEY=${SESSION_SECRET_KEY}

# Install necessary packages for Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start:prod"]