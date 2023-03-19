module.exports = {
	userRoute: require("./user.routers"),
	UserModel: require("./user.schema"),
};

// const express = require("express")
// const q2m = require("query-to-mongo")
// const { authenticate } = require("../auth/tools")
// const { authorize } = require("../auth/")

// const UserModel = require("./user.schema")

// const usersRouter = express.Router()

// const cloudinaryMulter = require('../../middlewares/cloudinary')

// usersRouter.get("/", authorize, async (req, res, next) => {
//   try {
//     console.log(req.user)
//     const users = await UserModel.find()
//     res.send(users)
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.get("/me", authorize, async (req, res, next) => {
//   try {
//     res.send(req.user)
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.post("/register", async (req, res, next) => {
//   try {
//     const newUser = new UserModel(req.body)
//     const { _id } = await newUser.save()

//     res.status(201).send(_id)
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.put("/me", authorize, async (req, res, next) => {
//   try {
//     const updates = Object.keys(req.body)
//     updates.forEach(update => (req.user[update] = req.body[update]))
//     await req.user.save()
//     res.send(req.user)
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.delete("/me", authorize, async (req, res, next) => {
//   try {
//     await req.user.deleteOne(res.send("Deleted"))
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.post("/login", async (req, res, next) => {
//   try {
//     const { email, password } = req.body
//     const user = await UserModel.findByCredentials(email, password)
//     const tokens = await authenticate(user)
//     res.send(tokens)
//   } catch (error) {
//     next(error)
//   }
// })

// usersRouter.put("/update/img", cloudinaryMulter.single("image"), authorize, async(req, res, next) => {
// 	try{
// 		const userId = req.user._id;
// 		const imgUrl = req.file.path;
// 		const editedProfile = await UserModel.findByIdAndUpdate(
// 			userId,
// 			{
// 				$set: { 
// 					image: imgUrl,
// 				 },
// 			},
// 			{ new: true }
// 		);
// 		if (!editedProfile) throw new ApiError(404, "User not found");

// 		res.status(201).send(editedProfile);
// 	} catch(error){
// 		console.log("user edit image error: ", error);
// 		next(error);
// 	}
// })

// usersRouter.post("/logout", authorize, async (req, res, next) => {
//   try {
//     req.user.refreshTokens = req.user.refreshTokens.filter(
//       t => t.token !== req.body.refreshToken
//     )
//     await req.user.save()
//     res.send()
//   } catch (err) {
//     next(err)
//   }
// })

// usersRouter.post("/logoutAll", authorize, async (req, res, next) => {
//   try {
//     req.user.refreshTokens = []
//     await req.user.save()
//     res.send()
//   } catch (err) {
//     next(err)
//   }
// })

// module.exports = usersRouter