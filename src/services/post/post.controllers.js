const PostModel = require("./post.schema");
const User = require("../users/user.schema")

exports.newPost = async (req, res, next) => {
	// if(req.file && req.file.path){
	// 	const file = req.file.path
	// 	console.log(file)
	// }
	const userId = req.user._id;
	//const imgUrl = req.file.path;
	const newPost = new PostModel({ ...req.body,  user: userId});
	await newPost.save();
	await User.findByIdAndUpdate(userId,{
		$push:{
			posts:[newPost]
		}
	})

	res.status(200).send(newPost);
}
exports.postImg = async (req, res, next) => {
	try {
		const userId = req.user._id;

		const imgUrl = req.file.path;

		const newPost = new PostModel({
			user: req.user._id,
			image: imgUrl,
		});
		await newPost.save();

		res.status(200).send(imgUrl);
	} catch (error) {
		console.log("new post image err: ", error);
		next(error);
	}
};

exports.getSpecificPost = async (req, res, next) => {
	try {
		const specificPost = await PostModel.findById(req.params.postId)
			// .populate({ path: "comments", populate: { path: "user" } })
			.populate("user");
		res.status(200).send(specificPost);
	} catch (error) {
		next(error);
	}
};
exports.getUserPosts = async (req, res, next) => {
	try {
		const result = await PostModel.find({ user: req.params.userId });
		res.send(result);
	} catch (err) {
		next(err);
	}
};
exports.getAllMyPosts = async (req, res, next) => {
	try {
		//console.log(req.user._id);
		const myPosts = await PostModel.find({ user: req.user._id })
			//.populate("user")
			.populate({ path: "user" });

		res.send(myPosts);
	} catch (error) {
		next(error);
	}
};
exports.getAllPosts = async (req, res, next) => {
	try {
		// first find my following ids

		let followingPost = [];
		let allPosts = [];

		for (let i = 0; i < req.user.following.length; i++) {
			const post = await PostModel.find({ user: req.user.following[i] })
				.populate("user")
				.populate({ path: "comments", populate: { path: "user" } });
			followingPost.push(post);

			// im getting an array of posts of people I following
		}
		const myPosts = await PostModel.find({ user: req.user._id })
			.populate("user")
			.populate({ path: "comments", populate: { path: "user" } });
		myPosts.map((post) => {
			allPosts.push(post);
		});
		for (let i = 0; i < followingPost.length; i++) {
			followingPost[i].forEach((element) => {
				allPosts.push(element);
			});
		}
		allPosts = allPosts.sort((a, b) => b.createdAt - a.createdAt);

		//then find all the posts of them
		// sort by date pending !!!!
		// send the respond

		res.send(allPosts);
	} catch (error) {
		next(error);
	}
};
exports.editSinglePost = async (req, res, next) => {
	try {
		if (req.file && req.file.path) {
			const editPost = await PostModel.findByIdAndUpdate(
				req.params.postId,
				{
					$set: {
						image: req.file.path,
					},
				}
			);
			const { _id } = await editPost.save();
			const myPosts = await PostModel.find({ user: req.user._id })
			res.status(201).send(myPosts);
		} 
		// else {
		// 	const editPost = await PostModel.findByIdAndUpdate(
		// 		req.params.postId,
		// 		{
		// 			$set: {
		// 				description: req.body.description,
		// 			},
		// 		}
		// 	);
		// 	const { _id } = await editPost.save();
		// 	res.status(201).send(_id);
		// }
	} catch (error) {
		next(error);
	}
};
exports.deletePost = async (req, res, next) => {
	try {
		const deletePost = await PostModel.findByIdAndDelete(req.params.postId);
		res.status(204).send('deleted');
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
		const foundPost = await PostModel.findOne({ _id: req.params.postId });

		const foundUserLike = foundPost.likes.find(
			(like) => like._id.toString() === user._id.toString()
		);

		if (!foundUserLike) {
			foundPost.likes.push(likeInfo);

			Promise.all([await foundPost.save()])
				.then((result) => res.status(200).send("Liked"))
				.catch((e) => next(new ApiError()));

			return;
		}

		foundPost.likes = foundPost.likes.filter(
			(like) => like._id.toString() !== user._id.toString()
		);

		await foundPost.save();
		res.status(200).send("Disliked");
	} catch (error) {
		next(error);
	}
};
