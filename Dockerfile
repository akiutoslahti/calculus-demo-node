FROM node:10-alpine

EXPOSE 8080
WORKDIR /calculus

COPY . /calculus
RUN npm install && \
    adduser -D calculus && \
    chown calculus:calculus /calculus

USER calculus

CMD npm run start
