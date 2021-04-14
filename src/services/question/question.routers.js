const questionRoute = require("express").Router();
const cloudinaryMulter = require("../../middlewares/cloudinary");
const { authorize } = require("../auth")
const {
	getAllMyQuestions,
	getAllQuestions,
	getSpecificQuestion,
	getUserQuestions,
	deleteQuestion,
	newQuestion,
	editSingleQuestion,
	handleLike,
	removeLike,
} = require("./question.controllers");

questionRoute.get("/all/me/questions", authorize, getAllQuestions);
questionRoute.get("/:questionId", getSpecificQuestion);
questionRoute.post("/newQuestion",  authorize, newQuestion);

questionRoute.get("/all/me", authorize, getAllMyQuestions);

questionRoute.get("/all/:userId", authorize, getUserQuestions);

questionRoute.post("/:questionId/like", authorize, handleLike);

questionRoute.delete("/:questionId", deleteQuestion);
questionRoute.put("/:questionId", editSingleQuestion);


module.exports = questionRoute;