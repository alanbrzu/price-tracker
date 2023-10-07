FROM node:alpine
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
EXPOSE 8000
RUN yarn install
CMD [ "yarn", "start" ]

# commands:
# docker build -f Dockerfile -t server .
# docker run -p 8000:8000 server