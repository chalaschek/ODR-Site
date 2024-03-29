var BeanstalkWorkerCluster = require('./lib/beanstalk_worker_cluster').BeanstalkWorkerCluster;

process.on('SIGINT', function() {
  BeanstalkWorkerCluster.stop();
});

process.on('TERM', function() {
  BeanstalkWorkerCluster.stop();
});

var options = {
  workers: 1,
  server: '127.0.0.1:11300',
  tubes: ['email'],
  ignore_default: true,
  handlers: ['./handlers/email']
};


// conf file
var config_file = process.argv[2];
var config_options = {};
if(config_file) {
  config_options = require(config_file);
}

for(var k in config_options) {
  if(config_options.hasOwnProperty(k)) {
    options[k] = config_options[k];
  }
}

var handlers = [];
for(var i=0; i< options.handlers.length; i++) {
  handlers.push(require(options.handlers[i]).handlers);
}

BeanstalkWorkerCluster.start(options.server, options.workers, handlers, options.tubes, options.ignore_default);