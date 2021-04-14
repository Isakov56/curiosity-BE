const {Schema , model} = require("mongoose")
const mongoose = require("mongoose")

const PostSchema = new Schema({
    image:{type:String, default: null},
    title:{type:String},
    content:{type:String},
    user:{type: mongoose.Schema.Types.ObjectId,ref:"Users"},
    comments:[{type:Schema.Types.ObjectId,ref:"Comments"}],
    likes: [
        {
          _id: { type: String, required: true },
          name: { type: String, required: true },
          surname: { type: String, required: true },
        },
      ],
    
}
,{timestamps:true}
)

const PostModel = mongoose.model("Posts", PostSchema)
module.exports = PostModel