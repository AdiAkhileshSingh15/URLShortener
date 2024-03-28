const crypto = require('crypto-js');

exports.generateHash = (url) => {
    const hash = crypto.SHA256(url).toString(crypto.enc.Hex);
    return hash.substring(0, 8);
}