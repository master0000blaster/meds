function create(type, isIdentity) {
    return {
        value : "",
        type : type,
        isIdentity : isIdentity == undefined || isIdentity == null || !isIdentity ? false : true
    };
}

exports.create = create;