const options = require("./options");

const rateLimitorStore = new Map();

function rateLimitor(options){
    const timeWindow = options.timeWindow;
    const maxRequest = options.maxRequest;

    return (req, res, next)=>{
        const clientIp = req.ip;
        const currentTime = Date.now();

        if(!rateLimitorStore.has(clientIp)){
            rateLimitorStore.set(clientIp,{
                    requestCount: 1, 
                    firstRequestTimeStamp: currentTime
                });
            return next();
        }
        const {requestCount, firstRequestTimeStamp} = rateLimitorStore.get(clientIp);
        if(currentTime - firstRequestTimeStamp < timeWindow){
            if(requestCount >= maxRequest){
                res.set('Retry-After', Math.ceil((timeWindow - (currentTime - firstRequestTimeStamp)) / 1000));
                return res.status(429).json({message: 'To many requests'});
            }else{
                rateLimitorStore.set(clientIp, {
                    requestCount: requestCount + 1, 
                    firstRequestTimeStamp : firstRequestTimeStamp,
                });
                return next();
            }

        }else{
            rateLimitorStore.set(clientIp, {
                requestCount : 1,
                firstRequestTimeStamp : currentTime,
            });
            return next();
        }

    }
}

module.exports = rateLimitor;