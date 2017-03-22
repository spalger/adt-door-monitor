FROM node:7.7

WORKDIR /repo
COPY package.json package.json
RUN npm install

COPY src src
COPY .babelrc .babelrc
COPY .env .env
COPY .env.default .env.default
COPY yarn.lock yarn.lock

RUN npm run build
CMD ["npm", "start"]