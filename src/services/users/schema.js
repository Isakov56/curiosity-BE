const { Schema, model } = require('mongoose')

const bcrypt = require('bcryptjs')

const userPlaceholderImg =
	"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

const UserSchema = new Schema({
  name: { type: String },
  surname: { type: String },
  username: { type: String, unique: true },
  email: { type: String },
  password: { type: String },
  bio: { type: String },
  refreshTokens: [{ token: String }],
  image: {
    type: String,
    default: userPlaceholderImg,
  },
})

UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email })
  
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) return user
      else return null
    } else return null
  }

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
  
    delete userObject.password
    delete userObject.__v
  
    return userObject
  }

UserSchema.pre("save", async function(next) {
    const user = this 
    if(user.isModified("password")){
        user.password=await bcrypt.hash(user.password, 10)
    }
    next()
})

module.exports = model('user', UserSchema)