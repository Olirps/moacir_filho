var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Moacir Filho - Backend',
  description: 'Back end das aplicacoes Moacir Filho',
  script: 'C:\\Projetos\\moacir_filho\\src\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();