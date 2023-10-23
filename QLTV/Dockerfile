# syntax=docker/dockerfile:1
   
FROM node:18-alpine
WORKDIR /QLTV
COPY . .
RUN yarn install --production
CMD ["node","express", "src/server.js"]
EXPOSE 8080