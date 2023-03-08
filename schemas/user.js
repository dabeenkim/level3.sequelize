const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nickname:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
});

// 가상의 userId 값을 할당
UserSchema.virtual("userId").get(function () {
    return this._id.toHexString();
  });
  
  // user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
  UserSchema.set("toJSON", {
    virtuals: true,
  });


const Users = mongoose.model('User', UserSchema);

module.exports = Users;

//module.exports = mongoose.model('User', UserSchema)
//이렇게 사용해도됨