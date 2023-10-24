# Use an official Node.js runtime as a parent image
FROM node:14

RUN mkdir -p /src/app
# Set the working directory in the container
WORKDIR /src/app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port your Express API will run on
EXPOSE 4000

# Define the command to run your application
CMD ["node", "index.js"]
