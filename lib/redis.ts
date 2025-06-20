import IORedis from 'ioredis';

declare global {
  var redis: IORedis | undefined;
}

const redis = global.redis ?? new IORedis("redis://default:BBEFuBpgdRcjapOtuuPsKVaihyxEZewS@turntable.proxy.rlwy.net:33985", {
  maxRetriesPerRequest: null,
});

if (!global.redis) global.redis = redis;

export default redis;
