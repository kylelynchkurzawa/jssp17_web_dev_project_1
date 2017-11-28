var express = require('express');
var router = express.Router();

let start_times = []

let some_session

let mysql = require("mysql")
let conn_open = false
let mydb_connection = mysql.createConnection(
  {
    host     : 'localhost',
    user     : 'admin',
    password : 'Win_Sys_1',
    database : 'mydb',
  })
mydb_connection.connect()

/* GET home page. */
router.get('/', function(req, res, next) {
  some_session = req.session;
  try{
    open_DB_conn()
    //gonna be alot of duplicates, MUST use distinct
    let my_query = "SELECT DISTINCT start_time FROM recordings;"
    mydb_connection.query(my_query,
      function(err, rows, fields) {
        if (err) {
            throw err;
        }
        else{
          for(let m=0; m<rows.length; m++){
            start_times.push(rows[m].start_time)
          }
          //console.log(`returned set: ${start_times}`)
          
          close_DB_conn()
          res.render('Browser_Piano', { start_times_list : start_times });
        }
      }
    )
  }
  catch(exception){ 
    console.log("something went wrong inside index.js") 
    close_DB_conn()
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
