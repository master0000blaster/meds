function create(type, isIdentity , excludeUpdateInsert) {
    return {
        value : "",
        type : type,
        isIdentity : isIdentity == undefined || isIdentity == null || !isIdentity ? false : true,
        excludeUpdateInsert : excludeUpdateInsert == undefined || excludeUpdateInsert == null || !excludeUpdateInsert ? false : true,
    };
}

exports.create = create;