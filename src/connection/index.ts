import { createConnection } from "typeorm";
import { Users } from "../entity/User";
import  testUserList  from '../testData/index'

export const myConnection = createConnection();