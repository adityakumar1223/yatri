const asyncWrapper = (fn) =>{
    return function(req, res, next){
        fn(req, res, next).catch((err)=> next(err));
    };
};


function asyncWrap(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err)=> next(err));
    }
};

export {asyncWrapper, asyncWrap};0
