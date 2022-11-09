const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, maxLength: 25 },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
  },
  { timestamps: true }
);

UserSchema.virtual('formatted_createdAt').get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

UserSchema.virtual('url').get(function () {
  return '/profile/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);