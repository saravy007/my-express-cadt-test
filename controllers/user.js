const expressAsyncHandler = require("express-async-handler");
const { users } = require("../database/db.js");
const Tweet = require("../models/tweet.js");
const User = require("../models/user");
const Book = require("../models/book.js");

const getUsers = async (req, res) => {
  //res.json(users)
  const users = await User.find().populate("tweets");
  return res.json(users);
};

const getUser = async (req, res) => {
  //use with array json
  // const userId = req.params.id
  // //console.log(userId)
  // const user = users.find((user) => {
  //     return user.id == userId
  // })
  // if(!user){
  //     res.json({"user": ""})
  // }
  // res.json(user)
  const userId = req.params.id;
  const user = await User.findById(userId);
  return res.json(user);
};

const createUser = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const user = new User({
      name: name,
      email: email,
    });
    const result = await user.save();
    return res.json(result);
  } catch (err) {
    next(Error(err.errmsg));
  }
};

const deleteUserById = async (req, res) => {
  const id = req.params.id;
  const result = await User.deleteOne({ _id: id });
  return res.json(result);
};

const updateUserByID = async (req, res) => {
  const id = req.params.id;
  const updateDocument = {
    $set: {
      name: "sok sao",
    },
  };
  const result = await User.updateOne({ _id: id }, updateDocument);
  return res.json(result);
};

const getTweetByUserID = async (req, res) => {
  const id = req.params.id;
  const result = await Tweet.find({
    byUser: id,
  });
  return res.json(result);
};

const getbooksByUserID = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await Book.find({
    authors: {
      $elemMatch: {
        $eq: id,
      },
    },
  });
  return res.json(result);
});

const updateUserByIDDB = expressAsyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { password, confirmedPassword, ...self } = req.body;
  const result = await User.updateOne({ ...self, id });
  const user = await User.findById(id);
  return res.json({ result, user });
});

module.exports = {
  getUser,
  getUsers,
  createUser,
  deleteUserById,
  updateUserByID,
  getTweetByUserID,
  getbooksByUserID,
  updateUserByIDDB,
};
