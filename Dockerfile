# Use an official Node.js image as the base image
FROM 10.60.129.132:8890/node:18-alpine

# Set the working directory
WORKDIR /home/node/app

# Copy files to the working directory
COPY . /home/node/app

# Expose port
EXPOSE 8000