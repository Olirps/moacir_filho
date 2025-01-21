var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Dione Goulart - Backend',
  description: 'Back end das aplicacoes Dione Goulart',
  script: 'C:\\Projetos\\apigerencial-dionegoulart\\src\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();