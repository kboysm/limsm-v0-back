import { User } from "../entity/User";
import { Product } from "../entity/Product";
import { OrderInfo } from "../entity/OrderInfo";
import crypto from 'crypto'
import secretKey from '../secretKey/index'
const userNameList: Array<string> = ['admin','user1','user2','user3'];
const userAgeList: Array<number> = [29,20,21,22]
const userAddressList: Array<string> = [
    '서울특별시 성동구','서울특별시 강남구','서울특별시 도봉구','서울특별시 노원구'
]
const userIdList: Array<string> = ['admin','test1','test2','test3']
const userPwList: Array<string> = ['1234','1234','1234','1234']
export const userList: Array<User> = []

for(let i=0 ; i <4 ; i++){
    const user: User = new User();
    user.name = userNameList[i];
    user.age = userAgeList[i];
    user.address = userAddressList[i];
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.email = userIdList[i]+'@asd.asd';
    user.tel = '010-0000-0000';
    user.password = crypto.createHmac('sha256',secretKey.cryptoKey).update(userPwList[i]).digest('hex')

    userList.push(user);
}



export const productList: Array<Product> = []
const ProductNameList: Array<string> = [
    '프리플로우 GAMING CREATOR 356S',
    '한성컴퓨터 보스몬스터 DX5516SRX (M2 256GB)',
    '프리플로우 ULTRA GAMING I7 B7',
    '다나와표준PC ULTIMAKE PC No.4 (M2 500GB)',
    '프리플로우 ELITE 홈오피스 i3 (SSD 240GB)',
    '한성컴퓨터 TFG DX2909X (16GB, M2 512GB)',
    '프리플로우 ULTRA GAMING R5 B7',
    '한성컴퓨터 프리워커 F2500'
];

const descriptionList: Array<string> = [
    'http://iws.danawa.com/prod_img/500000/142/147/desc/prod_11147142/add_1/20200422163038656_0E5WZOYH.jpg',
    'http://iws.danawa.com/prod_img/500000/784/199/desc/prod_10199784/add_1/20191220115711975_2NQVBG51.jpg',
    'http://iws.danawa.com/prod_img/500000/265/583/desc/prod_12583265/add_1/20210204124328751_31416IJ2.jpg',
    'http://iws.danawa.com/prod_img/500000/130/265/desc/prod_10265130/add_1/20200102120719872_FIHFROD1.jpg',
    'http://iws.danawa.com/prod_img/500000/104/595/desc/prod_11595104/add_1/20200618093731541_T1HGA74A.jpg',
    'http://iws.danawa.com/prod_img/500000/871/003/desc/prod_13003871/add_1/20201224145256516_NX43LQ70.jpg',
    'http://iws.danawa.com/prod_img/500000/554/654/desc/prod_12654554/add_1/20201201172846408_FVN5IWVA.jpg',
    'http://iws.danawa.com/prod_img/500000/883/889/desc/prod_11889883/add_1/20210114110135937_L6TOZSRB.jpg'
]

const quantityList: Array<number> = [
    5,6,7,8,9,3,2,8
]

const gradeList: Array<number> = [
    20,20,3,8,5,15,25,8
]

const salesQuantityList: Array<number> = [
    5,4,3,2,1,7,8,2
]

const priceList: Array<number> = [
    758990,998990,1778990,6300000,359000,3798990,1838990,468990
]

for(let i=0 ; i <8 ; i++){
    const product: Product = new Product();
    product.imgUrl = 'img/'+ i +'.PNG'
    product.name= ProductNameList[i];
    product.description = descriptionList[i];
    product.quantity= quantityList[i];
    product.grade= gradeList[i];
    product.salesQuantity= salesQuantityList[i];
    product.price= priceList[i];
    product.createdAt= new Date();
    product.updatedAt= new Date();
    productList.push(product);
}

