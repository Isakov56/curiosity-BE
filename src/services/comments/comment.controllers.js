const CommentModel = require("./comment.schema");
const PostModel = require("../post/post.schema");
const ObjectId = require("mongodb").ObjectID;
exports.getComments = async (req, res, next) => {
	try {
        const postId = req.params.postId
		const comments = await CommentModel.find({'post': postId}).populate("user", { name: 1, surname: 1, image: 1 }).populate("Post");

		if (comments.length > 0) {
			res.status(200).send(comments);
		} else {
			res.status(404).send("404 not found or you dont have any comments");
		}
	} catch (error) {
		next(error);
	}
};




exports.deleteComment = async(req,res,next)=>{
    try {
        const deleteComment = await CommentModel.findByIdAndDelete(req.params.commentId)
        const post = await PostModel.findOne({_id:req.params.postId})
       post.comments= post.comments.filter(comment => comment._id.toString() !== req.params.commentId.toString() )
     
        await post.save()
        const words = [1,2,3,4];
        const result = words.filter(word => word !== 2);
        console.log(post.comments[0].toString(),req.params.commentId.toString())
        res.status(204).send(post.comments)
        
    } catch (error) {
        next(error)   
    }
}
exports.editComment = async(req,res,next)=>{
    const editedComment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        req.body,
        {
            runValidators:true,
            new:true,
        }
    )
 
       
       
    res.status(200).send(editedComment._id)
}
exports.addComment = async(req,res,next)=>{
    try{
        const postId = req.params.postId
        const comments = await CommentModel.find({'post': postId}).populate("user", { name: 1, surname: 1, image: 1 }).populate("Post");
        const newComment = new CommentModel({
            user: req.user._id,
            post: req.params.postId,
            ...req.body
        })
        const {_id} =await newComment.save()
        console.log(req.params.postId,"here")
        await PostModel.findByIdAndUpdate(req.params.postId,{
            $push:{
                comments:[{
                    _id:ObjectId(_id)
                }]
            }
        })
        if (comments.length > 0) {
			res.status(200).send(comments);
		} else {
			res.status(404).send("404 not found or you dont have any comments");
		}
    }catch(error){
        next(error)
    }
}

