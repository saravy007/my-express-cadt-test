const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();
const port = 4000;
const {
  logger,
  errorHandle,
  verifyToken,
  validateToken,
} = require("./middlewares");
const userRouter = require("./routes/user.js");
const bookRouter = require("./routes/book.js");
const tweetRouter = require("./routes/tweet.js");
const authRouter = require("./routes/auth.js");
const bodyParser = require("body-parser");
const dbConnect = require("./database/mongo_db.js");
require("dotenv").config();
const passport = require("passport");
const jwtStrategy = require("./common/straegies/jwt-strategy.js");
const upload = require("./middlewares/upload.js");
const { rateLimit } = require("express-rate-limit");
// const File = require("./models/file.js");
// const expressAsyncHandler = require("express-async-handler");
// const { uploadFile, getFile } = require("./controllers/file.js");
const fileRouter = require("./routes/file.js");

const key = fs.readFileSync("localhost-key.pem", "utf-8");
const cert = fs.readFileSync("localhost.pem", "utf-8");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  limit: (req, res) => {
    if (validateToken(req)) {
      return 300;
    } else {
      return 100;
    }
  }, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

dbConnect().catch((err) => {
  console.log(err);
});
passport.use(jwtStrategy);
app.use(bodyParser.json());
app.use(logger);
app.use("/auth", authRouter);
app.use("/users", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/books", passport.authenticate("jwt", { session: false }), bookRouter);
app.use(
  "/tweets",
  passport.authenticate("jwt", { session: false }),
  tweetRouter
); //verifyToken
// Basic error handling middleware

// app.post("/upload", upload, uploadFile);
app.use("/upload", fileRouter);
// app.get("/files/:id", getFile);

app.use(errorHandle);
// server = https.createServer({ key, cert }, app);
// server.listen(port, () => {
//   console.log("Listening on port 4000!");
// });
app.listen(port, () => {
  console.log("Listening on port 4000!");
});
