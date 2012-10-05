# ODR Site

# System dependencies

TODO: add this

# Install Node.js dependencies

$ npm install

# Start up MongoDB

Start Mongodb on port 27017.

$ /etc/mongo/binmongod --journal --fork --logpath /var/log/mongod.log --dbpath /mnt/odrebs/data/db

# Start beanstalkd

$ beanstalkd -p 11300 -b /var/log/beanstalkd/ -f 0 -d

# Start main web application

$ forever start app.js

# Start email workes

$ forever start email_worker/email_queue.js