import { createConnection  } from "typeorm";
import { User } from "../entity/User";
import  testUserList  from '../testData/index'

export let myConnection = createConnection();
