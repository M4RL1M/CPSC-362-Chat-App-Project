import User from "../models/user.model.js";

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

     // https://avatar-placeholder.iran.liara.run/
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

    }   catch (error) {
      console.log("Error in signup  ", error);  
    }
}

export const login = (req, res) => {
    console.log("Login User");  
  } 

export const logout = (req, res) => {
    console.log("Logout User");  
  }