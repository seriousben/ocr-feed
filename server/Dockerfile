FROM node:6.9-wheezy

WORKDIR /opt/app
COPY . .

ENV PG_CONNECTION_STRING postgres://postgres@localhost:5432/postgres

RUN npm install --production && npm cache clean

EXPOSE 3000
CMD ["npm", "start"]
