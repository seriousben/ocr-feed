FROM node:6.9-wheezy

WORKDIR /opt/app
COPY . .

ENV API_HOST http://ocr-feed-api.seriousben.com
ENV FASTBOOT_API_HOST http://ocr-feed-api.seriousben.com

RUN npm install bower ember-cli -g && npm install && bower install --allow-root && ember build

EXPOSE 4000
CMD ["npm", "start"]
