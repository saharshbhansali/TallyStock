# Start from the official Node.js LTS base image
FROM node:20

# Set the current working directory inside the container
WORKDIR /frontend

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install dependencies
RUN npm install next@latest react@latest react-dom@latest --loglevel verbose
RUN npm install --loglevel verbose

# Copy the rest of the code
COPY . .

# Build the Next.js application
# RUN npm run build

# Add node binaries to path
# ENV PATH /app/node_modules/.bin:$PATH

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
# CMD ["npm", "start"]
# CMD ["npm", "run", "dev", "--loglevel", "verbose"]