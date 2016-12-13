FROM node:6.9-wheezy

RUN npm install bower ember-cli -g

WORKDIR /opt/app
COPY . .

# User accessible API host
ENV API_HOST http://ocr-feed-api.seriousben.com

# Fastboot accessible API host
ENV FASTBOOT_API_HOST http://ocr-feed-api.seriousben.com

# Pre-building the dist directory here to workaround a fastboot error.
# https://github.com/ember-fastboot/ember-cli-fastboot/issues/283

# TODO: Skip the build since it will always have the wrong ENV variables in it
#       since we using ENV and not ARGs.

RUN npm install && bower install --allow-root && ember build --environment production

EXPOSE 4000
CMD ["npm", "start"]
