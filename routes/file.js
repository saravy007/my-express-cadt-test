const express = require("express");
const {
  uploadFile,
  getFile,
  uploadFileS3,
  deleteFileOnS3,
} = require("../controllers/file");
const upload = require("../middlewares/upload");
const uploadS3 = require("../middlewares/uploadS3");
const fileRouter = express.Router();

fileRouter.post("/", upload, uploadFile);
fileRouter.get("/files/:id", getFile);
fileRouter.post("/s3", uploadS3, uploadFileS3);
fileRouter.delete("/s3/:id", deleteFileOnS3);

module.exports = fileRouter;
