import IORedis from 'ioredis';

/* eslint-disable no-var */
declare global {
  var redis: IORedis | undefined;
}
/* eslint-enable no-var */

const redis = global.redis ?? new IORedis("redis://:3tp8b1v2Z6qV79j0BQLfslwDdyI4YnS5@cgk1.clusters.zeabur.com:31347", {
  maxRetriesPerRequest: null,
});

if (!global.redis) global.redis = redis;

export default redis;
