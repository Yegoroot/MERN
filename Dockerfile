# you can use apline version
FROM node:14-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app
# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

USER node

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .


EXPOSE 8080
CMD [ "npm", "dev" ]

#CMD [ "npm", "dev" ]
#VOLUME ["/app/public"]
#CMD flask run --host=0.0.0.0 --port=5000
