const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError,UnauthenticatedError } = require("../errors/index");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
//saving user in data base and hashing the password using mongo 'pre' middleware 
  const user = await User.create({ ...req.body });
  //creating token
  const token=user.createJwt();
  res.status(StatusCodes.CREATED).json({user:{name:user.name},token});

};
const login = async (req, res) => {
  
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please enter email and password");
    }
    //checking if the user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Please enter valid credentials");
    }
    //compare passwords
   isMatched=  await user.comparePassword(password);
if(!isMatched)
{
  throw new UnauthenticatedError("Please enter valid credentials");
}
// as we found the user we are creating the token
const token=user.createJwt();
//sending token in the response
res.status(StatusCodes.OK).json({user:{name:user.name},token});


};

module.exports = {
  register,
  login,
};
