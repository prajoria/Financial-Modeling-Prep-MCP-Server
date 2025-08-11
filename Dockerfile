FROM node:lts-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application
RUN npm run build

# Create production image
FROM node:lts-alpine AS runner

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Start the server using environment variables for configuration
CMD ["node", "dist/index.js"] 