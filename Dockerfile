FROM node:14-alpine
WORKDIR /
COPY package.json /
RUN npm install
COPY . .
EXPOSE 8002
RUN npm build
CMD ["npm", "run", "start"]
