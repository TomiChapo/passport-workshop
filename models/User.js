'use strict';

var db = require('./database');
var Sequelize = require('sequelize');
var crypto = require('crypto');


var User = db.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    salt: Sequelize.STRING,
}, {
        setterMethods: {
            password: function (userpassword) {
                var salt = this.genRandomString(); /** Gives us salt of length 16 */
                var passwordData = this.sha512(userpassword, salt);
                this.setDataValue('password', passwordData)
                this.setDataValue('salt', salt)
            }
        }
    });

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
User.prototype.genRandomString = function () {
    return crypto.randomBytes(20).toString('hex') /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
User.prototype.sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha1', salt).update(password).digest('hex')
    return hash
};

User.prototype.VerifyPassword = function (password) {

    var pass = this.sha512(password, this.salt);
    if (pass === this.password) {
        return true
    }
    return false
}

User.serializeUser = function (user, done) {
    done(null, user.id);
};

User.deserializeUser = function (id, done) {
    User.findById(id)
        .then((user) => {
            done(null, user);

        })
        .catch((err) => {
            done(err)
        })
};




module.exports = User;
