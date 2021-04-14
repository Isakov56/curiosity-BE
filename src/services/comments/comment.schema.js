const { Schema,model } = require("mongoose")
const mongoose = require("mongoose")

const CommentSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        commentContent: {type:String}
    },
    {
        timestamps: true,
    }
)

const CommentModel= mongoose.model("Comments", CommentSchema)

module.exports = CommentModel