FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=7860

EXPOSE 7860

CMD ["npm", "start"]