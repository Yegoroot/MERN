FROM node:14.8.0

WORKDIR /nodedir

COPY package*.json ./ 

RUN npm ci --only=production

COPY . .

EXPOSE 5000
CMD [ "npm", "run", "start" ]