const postRoute = require("express").Router();
const cloudinaryMulter = require("../../middlewares/cloudinary");
const { authorize } = require("../auth/")
const {
	postImg,
	getAllMyPosts,
	getAllPosts,
	getSpecificPost,
	getUserPosts,
	deletePost,
	newPost,
	editSinglePost,
	handleLike,
	removeLike,
} = require("./post.controllers");

postRoute.get("/all/me/posts", authorize, getAllPosts);
postRoute.get("/:postId", getSpecificPost);
postRoute.post("/newPost", authorize, newPost);
postRoute.put("/:postId/editPostImg", authorize, cloudinaryMulter.single("post"), editSinglePost);

//postRoute.post("/newPost", authorize, newPost, cloudinaryMulter.single("post"), editSinglePost);

postRoute.get("/all/me", authorize, getAllMyPosts);

postRoute.get("/all/:userId", authorize, getUserPosts);

postRoute.post("/:postId/like", authorize, handleLike);

//postRoute.put("/:postId", cloudinaryMulter.single("image"), editSinglePost);

postRoute.delete("/:postId", deletePost);

postRoute.post(
	"/postImg",
	cloudinaryMulter.single("post"),
	authorize,
	postImg
);

module.exports = postRoute;
