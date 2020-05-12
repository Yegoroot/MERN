# иногда бывает с путями исполняет (необходимо другая версия)
# FROM node:14-alpine // для линукс
FROM node:14-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

# Рабочая директория
WORKDIR /app
RUN npm install nodemon -g

# Копируем файлы перед установкой на тот слуай чтоб не устанавливать пакеты если не было изминений в этих файлаъ
COPY package*.json ./ 

USER node

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .


EXPOSE 5000
CMD [ "npm", "run", "dev.docker" ]


#CMD [ "npm", "dev" ]
#VOLUME ["/app/public"]
#CMD flask run --host=0.0.0.0 --port=5000
