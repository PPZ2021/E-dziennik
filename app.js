const express = require ("express");
const path = require ('path');
const mysql = require ("mysql");
const dotenv = require ("dotenv");

dotenv.config({path: './.env'});

const app = express();
// database
const dataBase = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    email: process.env.DATABASE_EMAIL,
    database: process.env.DATABASE
});
// __dirname give access to current directory
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//parse urlencoded bodies(analizuje dane jakie wpisalismy do registera)
app.use(express.urlencoded({extended: false}));
//parse json bodies
app.use(express.json());
//hbs - template
app.set("view engine", 'hbs');

//check if connect to database
dataBase.connect( (error) => {
    if(error) {
        console.log(error)
    }else{
        console.log("MYSQL Connected")
    }
} )
//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(5000, ()=>{
    console.log("server started on Port 5000");
})