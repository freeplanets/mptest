import dotenv from 'dotenv';
import mariadb, { PoolConnection } from 'mariadb';
import { ErrCode } from '../../interface/ENum';
import { DbAns, Msg } from '../../interface/if';
import myPool from './NewPool';

dotenv.config();

export { PoolConnection }

export interface IAxParams {
    [key: number]: number|string|boolean;
}

const mdOptions: mariadb.PoolConfig = {
    host: process.env.MDHOST,
    user: process.env.MDUSER,
    password: process.env.MDPASSWORD,
    database: process.env.MDDATABASE,
    port: process.env.MDPORT ? parseInt(process.env.MDPORT, 10) : 3306,
    // timezone: 'Asia/Taipei',
    timezone: '+08:00',
    charset: 'UTF8',
    // idleTimeout: 600,
    connectionLimit: process.env.MAX_CONNECTIONS ? parseInt(process.env.MAX_CONNECTIONS, 10) : 30,
};

const dbPool: myPool = new myPool(mdOptions);

export function getConnection(caller?: string): Promise<PoolConnection|undefined> {
    return dbPool.getConnection(caller);
}
/**
 *
 * @param sql
 * @param conn
 * @param params
 * @returns connection query response or null when error occured
 */
export function doQuery(sql: string, conn: PoolConnection, params?: IAxParams): Promise<any> {
    let query: Promise<any>;
    if (params) {
        query = conn.query(sql, params);
    } else {
        query = conn.query(sql);
    }
    // console.log("doQuery:", sql, params);
    return new Promise((resolve) => {
        query.then((res) => {
            // console.log("doQuery", res);
            resolve(res);
        }).catch((err) => {
            // console.log("doQuery", sql, params, err);
            console.log("doQuery:", err, "SQL:", sql, "params:", params, "\nErrNo:", err.errno);
            Object.keys(err).map((key) => {
                console.log(key, ">", err[key]);
            });
            resolve(null);
        });
    });
}
export function Query(sql: string, conn: PoolConnection, params?: IAxParams): Promise<Msg> {
    let msg: Msg = { ErrNo: ErrCode.PASS };
    return new Promise((resolve) => {
        conn.query(sql, params).then((res: DbAns) => {
            msg = Object.assign(msg, res);
            if (msg.affectedRows === 0) {
                msg.ErrNo = ErrCode.NO_DATA_AFFECTED;
                msg.debug = sql;
                msg.debugPaam = params;
            }
            resolve(msg);
        }).catch((err) => {
            Object.keys(err).map((key) => {
                console.log(key, ">", err[key]);
            });
            msg.ErrNo = ErrCode.DB_QUERY_ERROR;
            msg.error = err;
            resolve(msg);
        });
    });
}
// export default dbPool;
