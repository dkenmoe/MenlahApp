import { AppDataSource } from "./data-source";
import express from 'express';
import { createUserRoute } from "./routes/create_user";
import { authenticationRoute } from "./routes/authentication";
import config from "config";

const app = express();
// let test = config.get("jwtPrivateKey");
// console.log(test);
// let ab = process.env.menlah_jwtPrivateKey;
// if(!test){
//   console.log(test);
//   console.error("FATAL ERROR: jwtPrivateKey is not defined"); 
//   process.exit(1);
// }

AppDataSource.initialize().then(async () => {

  app.use(express.json());
  app.use(createUserRoute);
  app.use(authenticationRoute);

  const server = app.listen(3000, () => {
    console.log("Server running on port");
  });

  // const user = new User();/**"dieudonné", "kenmoe", "dk@gmail.com" */
  // user.firstName = "dieudonné";
  // user.lastName = "kenmoe";
  // user.email = "dk@gmail.com";
  // await user.save();
  // console.log(user);

}).catch(error => console.log(error))