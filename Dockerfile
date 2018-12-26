FROM node:10-alpine

EXPOSE 3000
WORKDIR /calculus

COPY . /calculus
RUN yarn install --production && \
    adduser -D calculus && \
    chown calculus:calculus /calculus

CMD yarn start
