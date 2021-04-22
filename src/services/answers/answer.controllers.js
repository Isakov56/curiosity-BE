const AnswerModel = require("./answer.schema");
const QuestionModel = require("../question/question.schema");
const ObjectId = require("mongodb").ObjectID;
exports.getAnswers = async (req, res, next) => {
	try {
        const questionId = req.params.questionId 
		const answers = await AnswerModel.find({'question': questionId})
        //.populate("user", { name: 1, surname: 1, image: 1, jobQualification: 1}).populate("question");;

		if (answers.length > 0) {
            res.status(200).send(answers);
		} else {
			res.status(404).send("404 not found or you dont have any answers");
		}
	} catch (error) {
		next(error);
	}
};

exports.getAllAnswers = async (req, res, next) => {
	try {
        //const questionId = req.params._id 
		const answers = await AnswerModel.find()
        .populate("user", { name: 1, surname: 1, image: 1, jobQualification: 1}).populate("question");

        res.status(200).send(answers);
		// if (answers.length > 0) {
		// } else {
		// 	res.status(404).send("404 not found or you dont have any answers");
		// }
	} catch (error) {
		next(error);
	}
};

exports.getAllMyAnswers = async (req, res, next) => {
	try {
        const myAnswers = await AnswerModel.find({ user: req.user._id })
        .populate("user", { name: 1, surname: 1, image: 1, jobQualification: 1}).populate("question");

		res.send(myAnswers);
	} catch (error) {
		next(error);
	}
};

exports.editAnswerImage= async (req, res, next) => {
	try {
		if (req.file && req.file.path) {
			const editAnswer = await AnswerModel.findByIdAndUpdate(
				req.params.answerId,
				{
					$set: {
						image: req.file.path,
					},
				}
			);
			const { _id } = await editAnswer.save();
			const myAnswers = await AnswerModel.find({ user: req.user._id })
			res.status(201).send(myAnswers);
		}
	} catch (error) {
		next(error);
	}
};


exports.deleteAnswer = async(req,res,next)=>{
    try {
        const deleteAnswer = await AnswerModel.findByIdAndDelete(req.params.answerId)
        const question = await QuestionModel.findOne({_id:req.params.questionId})
       question.answers= question.answers.filter(answer => answer.toString() !== req.params.answerId.toString() )
     
        await question.save()
        const words = [1,2,3,4];
        const result = words.filter(word => word !== 2);
        console.log(question.answers[0].toString(),req.params.answerId.toString())
        res.status(204).send(question.answers)
        
    } catch (error) {
        next(error)   
    }
}
exports.editAnswer = async(req,res,next)=>{
    const editedAnswer = await AnswerModel.findByIdAndUpdate(
        req.params.answerId,
        req.body,
        {
            runValidators:true,
            new:true,
        }
    )
 
    res.status(200).send(editedAnswer)
}
exports.addAnswer = async(req,res,next)=>{
    try{
        const questionId = req.params.questionId
        const answers = await AnswerModel.find({'question': questionId}).populate("user", { name: 1, surname: 1, image: 1 }).populate("questions");
        const newAnswer = new AnswerModel({
            user: req.user._id,
            question: req.params.questionId,
            ...req.body
        }).populate("user", { name: 1, surname: 1, image: 1, jobQualification: 1}).populate("question");
        const {_id} =await newAnswer.save()
        console.log(req.params.questionId,"here")
        await QuestionModel.findByIdAndUpdate(req.params.questionId,{
            $push:{
                answers:[{
                    _id:ObjectId(_id)
                }]
            }
        })
        res.status(200).send(newAnswer);
    }catch(error){
        next(error)
    }
}