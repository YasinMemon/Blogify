const JWT = require('jsonwebtoken');

const secret = "SpiderMan"

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImgURL: user.profileImgURL
    }

    const token = JWT.sign(payload, secret);
    return token;
};

function validateToken(token){
    const payload = JWT.verify(token, secret);
    return payload;
};

module.exports = {
    createTokenForUser,
    validateToken
}