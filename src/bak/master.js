// master.js
const fs = require('fs');
const child_process = require('child_process');

for (var i=0; i<3; i++) {
  var workerProcess = child_process.fork('support.js', [i]);

  workerProcess.on('close', function(code){
    console.log('子進程己退出，退出碼 ' + code); 
  });
}
/*
for (var i=0; i<3; i++) {
  var workerProcess = child_process.spawn('node', ['support.js', i]);
  workerProcess.stdout.on('data', function(data){
    console.log('stdout: ' + data);
  });

  workerProcess.stderr.on('data', function(data){
    console.log('stderr: ' + data);
  });

  workerProcess.on('close', function(code){
    console.log('子進程己退出，退出碼 ' + code);
  });
}
*/
/*
for(var i=0; i<3; i++){
  var workerProcess = child_process.exec('node support.js ' + i, function(error, stdout, stderr){
    if(error){
      console.log(error.stack);
      console.log('Error code: ' + error.code);
      console.log('Single received: ' + error.singal);
    }
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
  });

  workerProcess.on('exit', function(code){
    console.log('子進程己退出，退出碼： ' + code);
  });
}
*/