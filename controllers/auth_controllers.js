import bcrypt from 'bcrypt'
import User from '../models/user_model.js'

export const signup = async(req,res)=>{
    try{
       const {email,username,password,confirmPassword} = req.body
       if(password!==confirmPassword)
       {
         return res.status(400).json({ error: "Passwords don't match" })
       }
       const user = await User.findOne({username});
       if (user) {
         return res.status(400).json({ error: "Username already exists" });
        }
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt)
     const newUser = new User({
       email,
       username,
       password:hashedPassword,
      })
     if(newUser)
     {
       await newUser.save()
       res.status(200).json({_id:newUser._id,email:newUser.email})
     }
     else
     {
       return res.status(400).json({ error: "Invalid user" })
     }
    }
    catch(err)
    {
     console.log(err)
     return res.status(500).json({ error: "Internal server error" })
    }
 }
 
 export const login = async(req,res)=>{
    try
    {
      const {email,password} = req.body;
      const user = await User.findOne({email});
      if(!user)
      {
        return res.status(400).json({ error: "Invalid username" })
      }
      const isPasswordcorrect = await bcrypt.compare(password,user.password)
      if(!isPasswordcorrect)
      {
        return res.status(400).json({ error: "Invalid password" })
      }
      res.status(200).json({_id:user._id,username:user.username,email:user.email})
    }
    catch(err)
    {
      console.log(err)
      return res.status(500).json({ error: "Internal server error" })
    }
  }
  
  export const forgotpw = async(req,res)=>{
    try{
      const {email,password,confirmPassword} = req.body;
      const user = await User.findOne({email});
      if(!user)
      {
        return res.status(400).json({ error: "Invalid username" })
      }
      if(password!==confirmPassword)
        {
          return res.status(400).json({ error: "Passwords don't match" })
        }
      const newpassword = await bcrypt.hash(password, 10);
      User.updateOne({ email : email }, { $set: { password:newpassword } })
     .then(() => {
      res.status(200).json({_id:user._id})
     })
     .catch(err => {
      console.log(err)
      return res.status(400).json({ error: "Unable change password" })
     });
    }
    catch(err)
    {
      console.log(err)
      return res.status(500).json({ error: "Internal server error" })
    }
  }