import mongoose from '../config/mongoose'
import plugin from 'mongoose-createdat-updatedat'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: String,
    facebookId: String,
    googleId: String,
    email: String,
    password: String,
    profileImage: String,
    gender: String,
    emailVerified: {
        type: Boolean,
        default: true
    },
    isAdmin: Boolean,
    createdAt: {type: Date, default: Date.now},
});
userSchema.plugin(plugin)

userSchema.methods.getRegisterType = function() {
    if(this.facebookId){
        return 'FACEBOOK'
    }else if(this.googleId){
        return 'GOOGLE'
    }else{
        return 'EMAIL'
    }
};
userSchema.methods.getProfile = function() {
  return {
      userId: this._id,
      userName: this.userName,
      email: this.email,
      profileImage: this.profileImage || 'https://i0.wp.com/ebus.ca/wp-content/uploads/2017/08/profile-placeholder.jpg?ssl=1'
  }
};

const User = mongoose.model('User', userSchema);
export default User
