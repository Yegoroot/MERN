FROM node:14-alpine

# Спицифика работы нодовского приложения, требует node_modules внуцтри
# RUN mkdir -p /app/node_modules

# Рабочая директория
WORKDIR /app

# Копируем файлы перед установкой на тот слуай чтоб не устанавливать пакеты если не было изминений в этих файлаъ
COPY package*.json ./ 

# RUN npm ci --production
RUN npm ci 

COPY . .

EXPOSE 5000
CMD [ "npm", "run", "start" ]

# ------------------------------------ 
# FROM node:14-alpine

# WORKDIR /usr/src/app

# COPY ./package.json /usr/src/app/package.json
# RUN mkdir -p  /usr/src/app/node_modules
# COPY node_modules/ /usr/src/app/node_modules
# COPY ./build/index.js /usr/src/app/index.js

# EXPOSE 5000

# CMD ["node", "server.js"]