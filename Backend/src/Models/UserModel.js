const db = require('../Config/db')

const UserModel= ()=>{
const sql=`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT, 
email CHAR UNIQUE NOT NULL,
password Text NOT NULL
)
`
db.run(sql,(err)=>{
if(err){
    console.error('Error creating users table:', err.message)
}
else{
   console.log('Users table create Sucessfully')
}
   
})

}
module.exports = UserModel