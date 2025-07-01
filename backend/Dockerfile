# Use a stable base image with Node.js (use Alpine for smaller size if desired)
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port
EXPOSE 5050

# Set environment mode
ENV NODE_ENV=production

# Start the app
CMD ["node", "server.js"]
