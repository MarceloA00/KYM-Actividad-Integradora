FROM node:14-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy all other files
COPY . .

# Build your app if needed
# RUN npm run build

EXPOSE 3000

CMD ["node", "src/app.js"]