import cluster, { Worker} from "cluster";
import os from 'os';
import process from 'process';

const numCPUs = os.cpus().length;

if (!cluster.isWorker) {
	console.log('my pid:', process.pid, process.argv);
	for (let i=0; i<numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('fork', (worker:Worker)=>{
		console.log(`Worker #${worker.id} fork`);
	});
	cluster.on('message', (worker:Worker, message:string)=>{
		console.log(`${worker.id} message: ${message}`);
		worker.send(`${worker.id} ${worker.process.pid} send msg`);
		worker.disconnect();
	});
	cluster.on('disconnect', (worker:Worker) => {
		console.log(`disconnect - ${worker.id} - ${worker.process.pid}`);
	});
	cluster.on('exit', (worker, code, signal) => {
		console.log('exit:', worker.process.pid, 'died', code, signal);
	});	
} else {
	if(process.send) {
		console.log('process:', process.pid, 'send');
		process.send(process.pid);
	}
	process.on('message',(msg:string)=>{
		console.log('process message:', msg);
	})
}