const services = require("express").Router();

const { postRoute } = require("./post");
const { questionRoute } = require("./question");
const { commentsRoute } = require("./comments");
const { answersRoute } = require("./answers");
const userRouter = require("./users/user.routers");

services.use("/comments", commentsRoute);
services.use("/answers", answersRoute);
services.use("/posts", postRoute);
services.use("/questions", questionRoute);
services.use("/users", userRouter);

module.exports = services;

console.log('maraz')