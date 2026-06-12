import { Redis } from "ioredis";

export const redis = new Redis({
  host:process.env.DEV_REDIS_CLOUD_URL,
  port: 12452,
  username: "default",
  password:process.env.REDIS_CLOUD_PASSWORD ,
  maxRetriesPerRequest: null,
});

redis.on("connect",()=>{
    redis.ping().then(console.log).catch(console.error);
})