FROM node:15
WORKDIR /app
COPY backend/package.json /app/
RUN npm install
COPY /backend /app
EXPOSE 8080
EXPOSE 8081
CMD [ "npm", "start" ]