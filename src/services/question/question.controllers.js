const QuestionModel = require("./question.schema");
const User = require("../users/user.schema")

exports.newQuestion = async (req, res, next) => {
	const userId = req.user._id;
	const newQuestion = new QuestionModel({ ...req.body,  user: userId });
	await newQuestion.save();
	await User.findByIdAndUpdate(userId,{
		$push:{
			questions:[newQuestion]
		}
	})

	res.status(200).send(newQuestion);
}

exports.getSpecificQuestion = async (req, res, next) => {
	try {
		const specificQuestion = await QuestionModel.findById(req.params.questionId)
		 .populate({ path: "answers", populate: { path: "user" } })
			.populate("user");
		res.status(200).send(specificQuestion);
	} catch (error) {
		next(error);
	}
};
exports.getUserQuestions = async (req, res, next) => {
	try {
		const result = await QuestionModel.find({ user: req.params.userId });
		res.send(result);
	} catch (err) {
		next(err);
	}
};
exports.getAllMyQuestions = async (req, res, next) => {
	try {
		console.log(req.user._id);
		const myQuestions = await QuestionModel.find({ user: req.user._id })
			.populate("user")
			.populate({ path: "answers", populate: { path: "user" } });

		res.send(myQuestions);
	} catch (error) {
		next(error);
	}
};
exports.getAllQuestions = async (req, res, next) => {
	try {
		// first find my following ids

		// let followingQuestion = [];
		// let allQuestions = [];

		// for (let i = 0; i < req.user.following.length; i++) {
		// 	const question = await QuestionModel.find({ user: req.user.following[i] })
		// 		.populate("user")
		// 		.populate({ path: "answers", populate: { path: "user" } });
		// 	followingQuestion.push(question);

		// 	// im getting an array of posts of people I following
		// }
		// const myQuestions = await QuestionModel.find({ user: req.user._id })
		// 	.populate("user")
		// 	.populate({ path: "answers", populate: { path: "user" } });
		// myQuestions.map((question) => {
		// 	allQuestions.push(question);
		// });
		// // for (let i = 0; i < followingPost.length; i++) {
		// // 	followingPost[i].forEach((element) => {
		// // 		allQuestions.push(element);
		// // 	});
		// // }
		// allQuestions = allQuestions.sort((a, b) => b.createdAt - a.createdAt);

		// //then find all the posts of them
		// // sort by date pending !!!!
		// // send the respond

		const allQuestions = await QuestionModel.find()
		.populate("user", { name: 1, surname: 1, image: 1, jobQualification: 1}).populate("answers");

		res.send(allQuestions);
	} catch (error) {
		next(error);
	}
};
exports.editSingleQuestion = async (req, res, next) => {
	try {
		// if (req.file && req.file.path) {
		// 	const editQuestion = await QuestionModel.findByIdAndUpdate(
		// 		req.params.questionId,
		// 		{
		// 			$set: {
		// 				image: req.file.path,
		// 			},
		// 		}
		// 	);
		// 	const { _id } = await editQuestion.save();
		// 	res.status(201).send(_id);
		// } else {
			const editQuestion = await QuestionModel.findByIdAndUpdate(
				req.params.questionId,
				{
					$set: {
						question: req.body.question,
					},
				}
			);
			const { _id } = await editQuestion.save();
			res.status(201).send(_id);
		//}
	} catch (error) {
		next(error);
	}
};
exports.deleteQuestion = async (req, res, next) => {
	try {
		const deleteQuestion = await QuestionModel.findByIdAndDelete(req.params.questionId);
		res.status(204).send("Deleted");
	} catch (error) {
		next(error);
	}
};


exports.handleLike = async (req, res, next) => {
	try {
		const user = req.user;

		const likeInfo = {
			_id: user._id,
			name: user.name,
			surname: user.surname,
			image: user.image,
		};
		const foundQuestion = await QuestionModel.findOne({ _id: req.params.questionId });

		const foundUserLike = foundQuestion.likes.find(
			(like) => like._id.toString() === user._id.toString()
		);

		if (!foundUserLike) {
			foundQuestion.likes.push(likeInfo);

			Promise.all([await foundQuestion.save()])
				.then((result) => res.status(200).send("Liked"))
				.catch((e) => next(new ApiError()));

			return;
		}

		foundQuestion.likes = foundQuestion.likes.filter(
			(like) => like._id.toString() !== user._id.toString()
		);

		await foundQuestion.save();
		res.status(200).send("Disliked");
	} catch (error) {
		next(error);
	}
};