FROM node:alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn install
CMD [ "yarn", "start" ]

# commands:
# docker build -f Dockerfile -t server .
# docker run -p 3001:3001 server