FROM node:18.20.3-slim
WORKDIR /app
ENV NODE_ENV dev
COPY package.json package-lock.json ./
RUN npm install
RUN apt-get update && apt install vim -y
COPY . .

WORKDIR /app/frontend
RUN npm install && npm run build
RUN cd ..
WORKDIR /app

EXPOSE 4000
CMD [ "npm", "run", "dev" ]