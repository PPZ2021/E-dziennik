const express = require ('express');
const authController = require ('../controllers/auth')
const router = express.Router();
//load auth controller, which is coming to ^^^^
router.post('/register', authController.register);

//export our router which we just created 
module.exports = router;