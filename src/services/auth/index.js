const atob = require("atob");
const UserModel = require("../users/user.schema");
const jwt = require("jsonwebtoken")
const { verifyJWT } = require("./tools")

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    
    const decoded = await verifyJWT(token)
    
    console.log("hello")
    const user = await UserModel.findOne({
      _id: decoded._id,
    })

    if (!user) {
      throw new Error("somth")
    }

    req.token = token
    req.user = user
    next()
  } catch (e) {
    const err = new Error("Please authenticate")
    err.httpStatusCode = 401
    next(err)
  }
}

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const err = new Error("Admins Only!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = {
  authorize,
  adminOnly: adminOnlyMiddleware,
};
