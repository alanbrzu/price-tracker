# build stage
FROM node:alpine AS build
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn install
RUN yarn build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

# commands:
# docker build -f Dockerfile -t client .
# docker run -p 8080:80 client