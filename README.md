# ODR Site

# System dependencies

TODO: add this

# Install

Start Mongodb on port 27017.

    $ mongod --journal --fork --logpath /var/log/mongod.log

Start beanstalkd on port 11300.

    $ beanstalkd -p 11300 -b /var/log/beanstalkd/ -f 0 -d
