var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

let start_times = []

let some_session

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
      let js_obj = JSON.parse(req.header("json_stringified_object"))
      
      let start_time = js_obj.recording_start_time 
      let end_time = js_obj.recording_end_time
      let notes = js_obj.recording_notes
      
      let queryString

      open_DB_conn()
      for(let m=0;m<notes.length; m++){
        queryString = `INSERT INTO recordings VALUES (${start_time}, 
                                                      ${end_time}, 
                                                     "${notes[m].key_pressed}", 
                                                      ${notes[m].key_pressed_time});`
        //console.log("my query string: "+queryString)
        mydb_connection.query(queryString, 
          function(err, rows, fields) {
              if (err) {
                  throw err;
              }
              else{
                  console.log("insert was successful")
              }
          }
        ); 
      } 
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