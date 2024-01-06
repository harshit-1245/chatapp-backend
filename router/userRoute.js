const express=require('express')
const {getUser,createUser,loginUser,}=require('../controllers/userControllers');
// const isAuthenticated = require( '../middleware/isAuthenticated' );

const router=express.Router();

router.route('/').get(getUser)

router.route('/register').post(createUser)
router.route('/login').post(loginUser)
// router.route('/logout').post(isAuthenticated,logOut)


module.exports=router;