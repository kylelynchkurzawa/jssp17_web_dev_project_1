var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

let start_times = []

let mysql = require("mysql")
let conn_open = false
let mydb_connection = mysql.createConnection(
  {
    host     : 'localhost',
    user     : 'admin',
    password : 'Win_Sys_1',
    database : 'mydb'
  })
mydb_connection.connect()

router.post('/', function(req, res, next) {
    try{
        let query = "SELECT DISTINCT start_time FROM recordings;";
        open_DB_conn()
        
        mydb_connection.query(query, 
            function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                else{
                    let returned_times = []

                    for(let i=0; i<rows.length; i++){
                        returned_times.push(rows[i].start_time)
                    }
                    // console.log(`returned set from select query: ${returned_set}`)
                    let stringified_obj = JSON.stringify(returned_times)
                    
                    //send response back to user??
                    res.send(stringified_obj)
                }
            }
          ); 
        
        close_DB_conn()
    }
    catch(exception){
      //catch the exception
      console.log("something bad happened in insert")
      console.log(exception)
    }
});

open_DB_conn=()=>{
  if(!conn_open){
    //mydb_connection.connect()
    conn_open = true
  }
}

close_DB_conn=()=>{
  if(conn_open){
    //mydb_connection.end()
    conn_open = false
  }
}

module.exports = router;