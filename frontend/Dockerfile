# Start from the official Node.js LTS base image
FROM node:20

# Set the current working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
# COPY ./package*.json ./

# Copy the rest of the code
COPY . .

# Install dependencies
RUN npm install

# Build the Next.js application
# RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
# CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]