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
        let js_query = JSON.parse(req.header("json_stringified_object"))
        let returned_set
        open_DB_conn()
        
        mydb_connection.query(js_query, 
            function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                else{
                    let returned_start_time, returned_end_time
                    let returned_rows = [] 

                    if(rows.length > 0){
                        returned_start_time = rows[0].start_time
                        returned_end_time = rows[0].end_time
                    }
                    for(let i=0; i<rows.length; i++){
                        returned_rows.push({
                            recorded_key_pressed : rows[i].key_pressed.toString(),
                            recorded_pressed_time : rows[i].pressed_time
                        })
                    }
                    returned_set = {
                        start_time : returned_start_time,
                        end_time : returned_end_time,
                        notes : returned_rows
                    }

                    let stringified_obj = JSON.stringify(returned_set)
                    
                    //send response back to user??
                    res.send(stringified_obj)
                }
            }
          ); 
        
        close_DB_conn()
        console.log("Finished select into db")
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