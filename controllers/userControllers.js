const asyncHandler=require('express-async-handler')
const User=require('../model/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const getUser=asyncHandler(async(req,res)=>{
    try {
        const users=await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({message: "Error fetching users"})
    }
})

const createUser = asyncHandler(async (req, res) => {
  const { firstname, email, password } = req.body;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const namePattern = /^[A-Za-z\s]+$/;

  // Check if the email matches the regex pattern
  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if the password matches the regex pattern
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: 'Password does not meet requirements' });
  }

  // Check if the name matches the regex pattern
  if (!namePattern.test(firstname)) {
    return res.status(400).json({ message: 'Invalid name format' });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, email, password: hashedPassword });

    // Use environment variable or a more secure method to store the secret key
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key');

    res.status(201).json({ message: 'User created successfully', user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});
const loginUser=asyncHandler(async(req,res)=>{
   const {email,password}=req.body;

   try {
    const user=await User.findOne({email});
    if(!user){
      return res.status(404).json({message:'User not found'})
    }
    // Compare the provided password with the hashed password in the database
    const passwordMatch=await bcrypt.compare(password,user.password);
        // If passwords don't match, return an error
        if(!passwordMatch){
          return res.status(401).json({message:'Invalid Password'})
        }
        // Passwords match, create a JWT token for authentication
        const token=jwt.sign({userId:user._id},'your_secret_key');
        // Return success response with the user details and token
        res.status(200).json({message:'Login Successful',user,token});
   } catch (error) {
    res.status(500).json({message:'Error logging in'});
   }

});

// const logOut=asyncHandler(async(req,res)=>{
//   try {
//      // Clear user information from local storage
//      localStorage.removeItem('userID');  //// Assuming 'userID' is the key for user data in local storage

//      res.status(200).json({message: 'Logged out successfully'});
//   } catch (error) {
//     res.status(500).json({message: 'Error logging out'});
//   }
// })

module.exports={getUser,createUser,loginUser}