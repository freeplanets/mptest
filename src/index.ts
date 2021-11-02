import cluster, { Worker} from "cluster";
// import WebSocket, { ServerOptions } from 'ws';
import dotenv from 'dotenv';
// import os from 'os';
import process from 'process';
import wsSvr from './class/server';
import msgMgr from './class/msgMgr';

dotenv.config();
// const numCPUs = os.cpus().length;

if (!cluster.isWorker) {
	console.log('my pid:', process.pid, process.argv);
	const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : '4000';
	const wsS = new wsSvr(port)
	cluster.fork();

	cluster.on('fork', (worker:Worker)=>{
		console.log(`Worker #${worker.id} fork`);
		wsS.Worker = worker;
	});
	cluster.on('message', (worker:Worker, message:string)=>{
		console.log(`${worker.id} message: ${message}`);
		worker.send(`${worker.id} ${worker.process.pid} send msg`);
		//worker.disconnect();
	});
	cluster.on('disconnect', (worker:Worker) => {
		console.log(`disconnect - ${worker.id} - ${worker.process.pid}`);
	});
	cluster.on('exit', (worker, code, signal) => {
		console.log('exit:', worker.process.pid, 'died', code, signal);
	});
	wsS.MainProcess = cluster;
} else {
	const mMgr = new msgMgr(process);
	/*
	process.on('message',(msg:string)=>{
		console.log('process message:', msg);
	});
	if(process.send) {
		console.log('process:', process.pid, 'send');
		process.send(process.pid);
	}
	*/	
}
