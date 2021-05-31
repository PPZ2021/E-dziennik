const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//import sql like in app.js
const mysql = require ("mysql");
const dataBase = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    //email: process.env.DATABASE_EMAIL,
    database: process.env.DATABASE
});
//async is for when we are using async and await we want to make sure that some action that we do here 
//they might take a little time to do so we need to make sure that the server is waiting for
//this actions to be done in order to precede the next lines of code
exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login', {
                message: 'Please provide a email and password'
            })
        }
        // results[0] because our results is whole table(?) like id name etc..
        dataBase.query('SELECT * FROM users WHERE email = ?', [email], (error, results) =>{
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{
                    message: 'Your email or password is incorrect'
                })
            }else{
                const id = results[0].id;
                const token = jwt.sign({id:id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("token is: " + token)

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 *60 * 1000 //to miliseconds
                    ),
                    httpOnly: true
                }
                //after user loged in we put a cookie into a browser
                res.cookie('jwt', token, cookieOptions);
                //IMPORTANT - AFTER LOGIN I SEND A USER TO THE HOMEPAGE "/"
                res.status(200).redirect("/");
            }

        })

    } catch(error){
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    //variables from our html from form
    /* const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm; */
    const {name, email, password, passwordConfirm} = req.body;

    dataBase.query('SELECT Email FROM users WHERE Email = ?', [email], async(error, results) =>{
        if(error) { console.log(error);}

        if(results.length > 0){return res.render('register', {
            message: 'That email is already in use!'
        })
        }
        else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords is not the same'
            })
        }
        //hash our password
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        
        //name ond database:value which we insert
        dataBase.query('INSERT INTO users SET ?', {name: name, email:email, password:hashedPassword }, (error, results) =>{
            if(error){console.log(error);}
            else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });



    //res.send("Form submitted");
}

