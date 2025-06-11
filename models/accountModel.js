// ----- import npm modules -----
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  account: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  lastLoginTime: { type: Date, default: null },
  verificationCode: { 
    code: { type: String, default: null },
    expireTime: { type: Date, default: null },
  },
  valid: { type: Boolean, default: true },
},
{
  versionKey: false
});

class AccountModel {
  constructor() {
    this.model = mongoose.model('Account', schema, 'Account');
  }
}

module.exports = new AccountModel().model;