# ODR Site

## System dependencies

Node.js, Express.js, mongodb

## Installation

### Node.js

Install node.js. See http://nodejs.org/

### Checkout code from GitHub

$ git clone git@github.com:chalaschek/ODR-Site.git

### Install Forever

$ npm install forever

### Install app node.js dependencies

Change working directory to ODR-Site. Then run from this directory:

$ npm install

### Start main web application

$ forever start app.js

## Additional installation

### Install MongoDB

See http://www.mongodb.org/

### Start up MongoDB

Start Mongodb on port 27017.

#### Local development

$ mongod --journal --fork

#### Production

$ /etc/mongo/bin/mongod --journal --fork --logpath /var/log/mongod.log --dbpath /mnt/odrebs/data/db

### Install beanstalk

See http://kr.github.com/beanstalkd/

#### Start beanstalkd

#### Local development

$ beanstalkd -p 11300 -f 0 -d

#### Production

$ beanstalkd -p 11300 -b /var/log/beanstalkd/ -f 0 -d

### Start email workers

$ forever start email_worker/emailer_queue.js
