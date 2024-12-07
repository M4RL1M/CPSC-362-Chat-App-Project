import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

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

      try {
          await newUser.save(); // Save the user to the database
    
          // Generate JWT token and set it in a cookie
          generateTokenAndSetCookie(newUser._id, res);
    
          return res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic,
          });
      } catch (saveError) {
          console.log("Error saving new user", saveError.message);
          return res.status(400).json({ message: "Invalid User Data" });
      }

    }   catch (error) {
      console.log("Error in signup", error.message);
      res.status(500).json({error: "Internal Server Error"}); 
    }
}

export const login = async (req, res) => {
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect){
      return res.status(400).json({error: "Invalid username or password"});
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    });

  }
  catch (error){
    console.log("Error in login controller", error.message);
    res.status(500).json({error: "Internal Server Error"}); 
  }
}; 

export const logout = (req, res) => {
  try{
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully"});
  }
  catch (error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({error: "Internal Server Error"}); 
  }
};