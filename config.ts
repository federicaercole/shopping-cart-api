import mysql, { PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const access: PoolOptions = {
    host: process.env.HOST,
    user: process.env.USER,
    port: Number(process.env.PORT),
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};

const pool = mysql.createPool(access);

export default pool;