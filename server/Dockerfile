# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /blindBox/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the application port
# EXPOSE 3000

# Command to run the API
CMD ["npm", "run", "dev"]

# build image
#  docker build --tag node-docker .
# run image
#  docker run -p 3000:3000 -d node-docker
# make a tagname for image
#  docker tag my-api your-dockerhub-username/my-api:v1
# push a image with tagname into docker hub
#  docker push your-dockerhub-username/my-api:v1
