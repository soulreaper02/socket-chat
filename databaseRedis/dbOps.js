const redis = require('redis');
const QPromise = require('q');
const config = require('../config');
let redisClient;

exports.ConnectToRedis = function(startUp) {
    redisClient = redis.createClient(config.redis_port, config.redis_hostname);

    redisClient.on('ready', function() {
        console.log('connected to Redis');
        startUp(true);
    });

    redisClient.on('error', function() {
        console.log('Failed to connect to Redis');
        startUp(false);
    });

    //The result of the above events will decide weather to start the server or not.

    exports.getMessages = (roomID, startPos, endPos) => {
        if (endPos == undefined) {
            if (startPos > -10 && startPos < 0) {
                endPos = -1;
            } else {
                endPos = startPos + 9;
            }
        }
        let deffered = QPromise.defer();
        redisClient.lrange(roomID, startPos, endPos, (err, res) => {
            if (!err) {
                let result = [];
                for (let message in res) {
                    result.push(JSON.parse(res[message]));
                }
                result.push(roomID);
                deffered.resolve(result);
            } else {
                deffered.reject(err);
            }
        });
        return deffered.promise;
    }

    exports.pushMessage = (data) => {
        redisClient.lpush(data.roomID, JSON.stringify({
            who  : data.isAdmin,
            what : data.message,
            when : data.timestamp 
        }));
    }

    

}

