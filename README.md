# calculus-demo-node
[![Build Status](https://travis-ci.org/akiutoslahti/calculus-demo-node.svg?branch=master)](https://travis-ci.org/akiutoslahti/calculus-demo-node)
[![codecov](https://codecov.io/gh/akiutoslahti/calculus-demo-node/branch/master/graph/badge.svg)](https://codecov.io/gh/akiutoslahti/calculus-demo-node)

## Application
Latest build live in [Heroku!](https://calculus-demo.herokuapp.com/)

Send a base64 encoded math expression to https://calculus-demo.herokuapp.com/calculus?query=[expression] and application will calculate it for you and respond with JSON.

### Example

Expression: 4 * 7 / 2 + 3  
Expression in base64: NCAqIDcgLyAyICsgMw==  
Query: https://calculus-demo.herokuapp.com/calculus?query=NCAqIDcgLyAyICsgMw==  
Response:
```
{
  error: false,
  result: 17
}
```

In case of malformatted expression, application will attempt identify fault and responds in following manner:
```
{
  error: true,
  message: [message depicting type of error]
}
```

## Run application locally
First clone the project from github, change directory to cloned projects directory and then use either node or docker to run it.
```
git clone https://github.com/akiutoslahti/calculus-demo-node.git
cd calculus-demo-node
```

### Node
Install dependencies
```
yarn install
```

To start and bind application to default port 3000
```
yarn start
```

To start and bind application to other port, e.g. 8080
```
PORT=8080 yarn start
```

Stop application with CTRL+C.

### Docker
Application binds to localhost port 80 when started with docker. To change port you can change port definitions in docker-compose.yml

Start application with docker-compose
```
docker-compose up -d
```

Stop application with docker-compose
```
docker-compose down
```

## Build stack and pipeline

Project is built using Node.js with Yarn dependency management. Travis CI is used for building and publishing image to Docker Hub, publishing test coverage results to codecov and deploying appication to Heroku. There is also a Dockerfile for building a docker image and a docker-compose file for running application on your own computer.

## Development stack used in project
- node 10.14.2
- yarn 1.12.3
- docker ce 18.09.0
- docker-compose 1.23.2

## Links
- [Travis CI](https://travis-ci.org/akiutoslahti/calculus-demo-node)
- [Codecov](https://codecov.io/gh/akiutoslahti/calculus-demo-node)
- [Docker Hub](https://hub.docker.com/r/akiutoslahti/calculus-demo)
- [Heroku](https://calculus-demo.herokuapp.com/)
