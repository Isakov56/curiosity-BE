const userRouter = require("express").Router();
const cloudinaryMulter = require('../../middlewares/cloudinary')
const { authorize } = require("../auth/")
const {
	getUserProfile,
	getAllUsers,
	editUserProfile,
    deleteUserProfile,
    editUserImg,
    savedPost,
    follow,
    unfollow,
	registerNewUser,
    loginUser,
    logOutUser,
    logOutAllUsers
} = require("./user.controllers");

// user general
userRouter.get("/me", authorize, getUserProfile);
userRouter.put("/me", authorize, editUserProfile);
userRouter.delete("/me", authorize, deleteUserProfile);
userRouter.get("/", authorize, getAllUsers);
userRouter.post("/savedPost/:savedPostId", authorize, savedPost);

// user image upload
userRouter.put("/me/update/image", 
authorize, 
cloudinaryMulter.single("image"),
editUserImg
)

// follow unfollow
userRouter.post("/follow/:followedUserId", authorize, follow);
userRouter.delete("/unfollow/:unfollowedUserId", authorize, unfollow);


// authorization
userRouter.post("/register",  registerNewUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", authorize, logOutUser)
userRouter.post("/logoutAll", authorize, logOutAllUsers)

module.exports = userRouter;