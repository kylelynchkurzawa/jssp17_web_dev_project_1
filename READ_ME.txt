Set up:

(1)
requires nodejs to be installed
https://nodejs.org/en/download/
go to the directory where the package.json file is and run "npm install"

(2)
requires mysql running locally
https://dev.mysql.com/downloads/installer/
create an administrator account called 'admin' with the password 'Win_Sys_1'
insatll mysql and create a database on port 3306 called "mydb"
create a "recordindings" table
sql statement needed:
CREATE TABLE recordings (start_time BIGINT, end_time BIGINT, key_pressed VARCHAR(5), pressed_time BIGINT);

(3)
run the app by going to the directory containing the package.json file
open cmd there and run "node bin/www"
use chrome to open on 'localhost:3306'