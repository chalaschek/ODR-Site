# ODR Site

# System dependencies

TODO: add this

# Install

Install node.js dependencies
    $ npm install


Start Mongodb on port 27017.

    $ /etc/mongo/binmongod --journal --fork --logpath /var/log/mongod.log --dbpath /mnt/odrebs/data/db

Start beanstalkd on port 11300.

    $ beanstalkd -p 11300 -b /var/log/beanstalkd/ -f 0 -d

Start primary web app
    $ forever start app.js

Start primary web app
    $ forever start email_worker/email_queue.js