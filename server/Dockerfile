FROM node:6.9-wheezy

RUN apt-get -q -y update && apt-get -q -y install libleptonica-dev libtesseract3 libtesseract-dev tesseract-ocr-eng

WORKDIR /opt/app
COPY . .

ENV PG_CONNECTION_STRING postgres://postgres@localhost:5432/postgres

RUN npm install --production && npm cache clean

EXPOSE 3000
CMD ["npm", "start"]
