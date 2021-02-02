import { createConnection , ConnectionOptions } from "typeorm";
import { User } from "../entity/User";
import  testUserList  from '../testData/index'

export const myConnection = createConnection();