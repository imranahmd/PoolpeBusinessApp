FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production --silent

RUN npm install react-scripts@5.0.1 -g --silent

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]

# Use official Node.js image from Docker Hub
#FROM node:latest

# Set the working directory inside the container
#WORKDIR /app

# Copy the package.json and package-lock.json files
#COPY package*.json ./

# Install dependencies
#RUN npm install

# Copy the rest of the application files
#COPY . .

# Build the Tailwind CSS if necessary or any other build steps
#RUN npm run build

# Expose the port that the app will run on
#EXPOSE 3000

# Run the application (adjust this based on how you start your app, e.g., with `npm start`)
#CMD ["npm", "start"]
