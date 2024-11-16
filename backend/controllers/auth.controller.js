import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {            
    try {
      const {fullname, username, password, confirmPassword, gender} = req.body;
      if(password !== confirmPassword) {
        return res.status(400).json({message: "Password do not match"});
      }
      const user = await User.findOne({username});
      if (user) {
        return res.status(400).json({message: "User already exists"});
      }

    // Hash Password Here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Generate Profile Picture URL
    const baseProfilePicUrl = "https://avatar.iran.liara.run/public";
    const boyProfilePic = `${baseProfilePicUrl}/boy?username=${username}`;
    const girlProfilePic = `${baseProfilePicUrl}/girl?username=${username}`;

      const newUser = new User({
        fullname, 
        username, 
        password: hashedPassword,
        gender,
        profilePic: gender === "male" ? boyProfilePic : girlProfilePic, 
        });
  

      if (newUser) {
        //Generate JWT Token
        
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
      }
      else {
        res.status(400).json({message: "Invalid User Data"});
      }

    }   catch (error) {
      console.log("Error in signup", error.message);
      res.status(500).json({error: "Internal Server Error"}); 
    }
}

export const login = (req, res) => {
    console.log("Login User");  
  } 

export const logout = (req, res) => {
    console.log("Logout User");  
  }