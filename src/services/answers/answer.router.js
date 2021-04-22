const answersRoute = require("express").Router()
const cloudinaryMulter = require("../../middlewares/cloudinary");
const { authorize } = require("../auth/")
const {
    getAnswers, addAnswer, editAnswer, deleteAnswer, getAllMyAnswers, editAnswerImage, getAllAnswers
   
}= require("./answer.controllers")

answersRoute.get("/:questionId",authorize,getAnswers)

answersRoute.get("/getAll/me",authorize,getAllMyAnswers)
answersRoute.get("/get/all/answers",authorize,getAllAnswers)

answersRoute.put("/:answerId/editAnswerImage", authorize, cloudinaryMulter.single("answer"), editAnswerImage);

answersRoute.post("/:questionId/add",authorize,addAnswer)

answersRoute.put("/:questionId/:answerId",authorize,editAnswer)

answersRoute.delete("/:questionId/:answerId",authorize,deleteAnswer)







module.exports = answersRoute