import { Users } from "../entity/User";
import crypto from 'crypto'
import secretKey from '../secretKey/index'
const userNameList: Array<string> = ['admin','user1','user2','user3'];
const userAgeList: Array<number> = [29,20,21,22]
const userAddressList: Array<string> = [
    '서울특별시 성동구','서울특별시 강남구','서울특별시 도봉구','서울특별시 노원구'
]
const userIdList: Array<string> = ['admin','test1','test2','test3']
const userPwList: Array<string> = ['1234','1234','1234','1234']
const userList: Array<Users> = []

for(let i=0 ; i <4 ; i++){
    const user: Users = new Users();
    user.name = userNameList[i];
    user.age = userAgeList[i];
    user.address = userAddressList[i];
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.email = userIdList[i]+'@asd.asd';
    user.password = crypto.createHmac('sha256',secretKey.cryptoKey).update(userPwList[i]).digest('hex')
    userList.push(user);
}

export default userList;