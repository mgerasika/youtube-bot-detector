# Use Node.js image
FROM node:18.19.1-alpine

# Define build-time argument
ARG PORT
ENV PORT=${PORT}

# Set up the working directory
WORKDIR /app

# Copy package.json and lock files to install dependencies
COPY package.json yarn.lock ./

# Install dependencies for the main project
RUN yarn install --frozen-lockfile

# Copy only the node_modules folder from the host
COPY node_modules ./node_modules

# Copy common library and application files
COPY common /app/common
COPY download-server /app/download-server

# Build common library
WORKDIR /app/common
RUN yarn build

# Move to the application folder, install, and build the app
WORKDIR /app/download-server
RUN yarn install --frozen-lockfile && yarn build

# Expose the application port
EXPOSE ${PORT}

# Start the application
CMD ["yarn", "start"]
