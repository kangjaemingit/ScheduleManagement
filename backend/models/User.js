const mongoose = require('mongoose');

/**
 * 담당자 : 강재민, 김건희
 * 함수 설명 : 일정 항목의 스키마입니다.
 * 주요 기능 : - 이름, id, 닉네임, 이메일, 프로필사진, 상단메뉴색상, 로그인SNS정보로 구성되어있습니다.
 * */
const userSchema = mongoose.Schema({
    name : { // 이름
        type : String
    },
    userId: { // SNS 측에서 제공하는 사용자의 id
        type : String
    },
    nickName : { // 닉네임
        type : String
    },
    email: { // 이메일
        type : String
    },
    profilePhoto : { // 프로필 사진
        type : String
    },
    navBgColor : { // 상단 메뉴 색상
        type : String
    },
    provider:{ // 로그인한 SNS 정보
        type : String
    }

});

const User = mongoose.model('User', userSchema);

module.exports = {User};