import WebSocket from 'ws';
import AClient from './AClient';
import Client from './Client';
import ApiServer from './ApiServer';
import SettleServer from './SettleServer';
import IChannelManager from '../../interface/Channel/Manager';
import { ClientInfo } from '../../interface/if';
import { Channels } from '../../interface/ENum';
// import IChanelClient from '../../interface/Channel/Client';

export default class ClientFactory {
	private CryptoSite = 'CryptoCurrency';
	get(ws:WebSocket, uInfo:ClientInfo, manager:IChannelManager):AClient {
		console.log('ClientFactory:', uInfo);
		if (uInfo.site === this.CryptoSite) {
			if (uInfo.dfChannel === Channels.API_SERVER) return new ApiServer(ws, uInfo, manager);
			if (uInfo.dfChannel === Channels.SETTLE_SERVER) return new SettleServer(ws, uInfo, manager);
		} 
		return new Client(ws, uInfo, manager);
	}
}