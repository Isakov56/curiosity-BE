const { Schema, model } = require("mongoose")
const mongoose = require("mongoose")

const AnswerSchema = new Schema(
    {
        image:{type:String, default: null},
        user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        question: { type: Schema.Types.ObjectId, ref: "Questions", required: true },
        content: { type: String},
        imgUrl: { type: String}
    },
    {
        timestamps: true,
    }
)

const CommentModel= mongoose.model("Answers", AnswerSchema)

module.exports = CommentModel