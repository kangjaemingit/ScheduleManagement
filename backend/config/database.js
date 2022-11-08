const mongoose = require('mongoose');
/**
 * 담당자 : 강재민
 * 함수 설명 : MONGO DB와 EXPRESS를 연결해주는 함수입니다.
 * 주요 기능 : mongoose 라이브러리를 사용하여 mongoDB와 연결하였습니다.
 * */
module.exports = () => {
    mongoose.connect(process.env['MONGO_URI'], {
        dbName : 'ScheduleManagement',
        authMechanism: 'DEFAULT',
    })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => {
            console.log("mongoDB connection ERROR : " + err);
        })
}