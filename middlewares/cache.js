const redis = require("redis");
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});
const expressAsyncHandler = require("express-async-handler");

client
  .on("error", (err) => {
    console.error("Redis error:", err);
  })
  .on("connect", () => console.log("Conneted to Redis server!"))
  .connect();

const cacheMiddleware = expressAsyncHandler(async (req, res, next) => {
  const { originalUrl } = req;
  //   console.log(req);
  const data = await client.get(originalUrl);
  if (data !== null) {
    res.json(JSON.parse(data));
  } else {
    next();
  }
});
module.exports = { cacheMiddleware };
