const {Schema , model} = require("mongoose")
const mongoose = require("mongoose")

const QuestionSchema = new Schema({
    question:{type:String},
    hashtag:[{type:String}],
    user:{type: mongoose.Schema.Types.ObjectId,ref:"Users"},
    answers:[{type:Schema.Types.ObjectId,ref:"Answers"}],
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

const QuestionModel = mongoose.model("Questions", QuestionSchema)
module.exports = QuestionModel