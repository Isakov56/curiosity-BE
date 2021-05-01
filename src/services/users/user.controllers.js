const express = require("express")
const q2m = require("query-to-mongo")
const { authenticate } = require("../auth/tools")
const PostModel = require("../post/post.schema");

const User = require("./user.schema")

exports.getAllUsers = async (req, res, next) => {
  try {
    //console.log(req.user)
    const users = await User.find().populate("posts").populate("questions").populate("followers").populate("following").populate("savedPosts")
    res.send(users)
  } catch (error) {
    next(error)
  }
}

exports.getUserProfile = async (req, res, next) => {
  
  try {
    const user = await User.findOne(req.user._id).populate("posts").populate("questions").populate("followers").populate("following").populate("savedPosts");
    res.send(user)
  } catch (error) {
    next(error)
  }
}

exports.registerNewUser = async (req, res, next) => {
  try {
  const { email, username } = req.body;
	const foundUserwithEmail = await User.findOne({ email });
	const foundUserwithUsername = await User.findOne({ username });
	if (foundUserwithUsername)
		throw new Error("Username already exist!");
	if (foundUserwithEmail) throw new Error(400, "Email already exist!");
	const newUser = User({ ...req.body });
	await newUser.save();

	res.status(200).send(newUser);
  } catch (error) {
    next(error)
  }
}

exports.editUserProfile = async (req, res, next) => {
  try {
    // const updates = Object.keys(req.body)
    // updates.forEach(update => (req.user[update] = req.body[update]))
    // await req.user.save()
    // res.send(req.user)
    const userId = req.user._id;

		const editedProfile = await User.findByIdAndUpdate(
			userId,
			{
				$set: { ...req.body },
			},
			{ new: true }
		);
		if (!editedProfile) throw new Error(404, "User not found");

		res.status(201).send(editedProfile);
  } catch (error) {
    next(error)
  }
}

exports.deleteUserProfile = async (req, res, next) => {
  try {
    await req.user.deleteOne(res.send("Deleted"))
  } catch (error) {
    next(error)
  }
}

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    const token = await authenticate(user)
    res.cookie("token", token.token, { httpOnly: true });
    res.cookie("isAuthUser", true);
	console.dir(req.cookies.isAuthUser)
    res.send(token)
  } catch (error) {
    next(error)
  }
}

exports.editUserImg = async(req, res, next) => {
	try{
		const userId = req.user._id;
		const imgUrl = req.file.path;
		const editedProfile = await User.findByIdAndUpdate(
			userId,
			{
				$set: { 
					image: imgUrl,
				 },
			},
			{ new: true }
		);
		if (!editedProfile) throw new Error(404, "User not found");

		res.status(201).send(editedProfile);
	} catch(error){
		console.log("user edit image error: ", error);
		next(error);
	}
}

exports.logOutUser = async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      t => t.token !== req.body.refreshToken
    )
    await req.user.save()
    res.send()
  } catch (err) {
    next(err)
  }
}

exports.logOutAllUsers = async (req, res, next) => {
  try {
    req.user.refreshTokens = []
    await req.user.save()
    res.send()
  } catch (err) {
    next(err)
  }
}

exports.follow = async (req, res, next) => {
	try {
		const { followedUserId } = req.params;
		const currentUser = req.user;
		const followedUser = await User.findById(followedUserId);

		if (!followedUser)
			throw new Error(404, "Followed User user is not found");

		currentUser.following.push(followedUser);
		followedUser.followers.push(currentUser._id);

		if (currentUser._id.toString() === followedUser._id.toString())
			throw new Error(400, "Users are same");

		//If one of them fails send error
		Promise.all([
			await currentUser.save(),
			await followedUser.save(),
		])
			.then((result) => res.status(200).send("Ok"))
			.catch((e) => next(new Error()));
	} catch (error) {
		console.log("follow error: ", error);
		next(error);
	}
};

exports.savedPost = async (req, res, next) => {
	try {
		const { savedPostId } = req.params;
		const currentUser = req.user;
		const savedPost = await PostModel.findById(savedPostId);

		if (!savedPost)
			throw new Error("Post is not found")

		currentUser.savedPosts.push(savedPost);

		//If one of them fails send error
		Promise.all([
			await currentUser.save(),
		])
			.then((result) => res.status(200).send("saved"))
			.catch((e) => next(new Error("error not saved")))
	} catch (error) {
		console.log("follow error: ", error);
		next(error);
	}
};

exports.unfollow = async (req, res, next) => {
	try {
		const { unfollowedUserId } = req.params;

		const currentUser = req.user;
		const unfollowedUser = await User.findById(unfollowedUserId);

		if (!unfollowedUser)
			throw new Error(404, "UnFollowed User user is not found");

		currentUser.following = currentUser.following.filter(
			(user) => user.toString() !== unfollowedUser._id.toString()
		);

		unfollowedUser.followers = unfollowedUser.followers.filter(
			(user) => user.toString() !== currentUser._id.toString()
		);

		//If one of them fails send error
		Promise.all([await currentUser.save(), await unfollowedUser.save()])
			.then((result) => res.status(200).send("Ok"))
			.catch((e) => next(new Error()));
	} catch (error) {
		console.log("unfollow error: ", error);
		next(error);
	}
};