# Указываем базовый образ Node.js
FROM node:16-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем всё остальное
COPY . .

# Указываем порт приложения
EXPOSE 8085

# Команда запуска приложения
CMD ["npm", "run", "dev"]