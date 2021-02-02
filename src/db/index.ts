import * as mysql from 'mysql'

const mysqlConnection: mysql.Connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'limsm'
})

mysqlConnection.connect();

export default mysqlConnection;