FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . .

EXPOSE 3000

CMD ["node", "src/app.js"]