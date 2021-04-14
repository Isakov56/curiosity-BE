const commentsRoute = require("express").Router()

const { authorize } = require("../auth/")
const {
    getComments, addComment, editComment, deleteComment
   
}= require("./comment.controllers")

commentsRoute.get("/:postId",authorize,getComments)

commentsRoute.post("/:postId/add",authorize,addComment)

commentsRoute.put("/:postId/:commentId",authorize,editComment)

commentsRoute.delete("/:postId/:commentId",authorize,deleteComment)







module.exports = commentsRoute