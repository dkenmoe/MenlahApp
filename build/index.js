"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const express_1 = __importDefault(require("express"));
const create_user_1 = require("./routes/create_user");
const authentication_1 = require("./routes/authentication");
const config_1 = __importDefault(require("config"));
const app = (0, express_1.default)();
let test = config_1.default.get("jwtPrivateKey");
console.log(test);
let ab = process.env.menlah_jwtPrivateKey;
if (!test) {
    console.log(test);
    console.error("FATAL ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use(create_user_1.createUserRoute);
    app.use(authentication_1.authenticationRoute);
    const server = app.listen(3000, () => {
        console.log("Server running on port");
    });
    // const user = new User();/**"dieudonné", "kenmoe", "dk@gmail.com" */
    // user.firstName = "dieudonné";
    // user.lastName = "kenmoe";
    // user.email = "dk@gmail.com";
    // await user.save();
    // console.log(user);
})).catch(error => console.log(error));
//# sourceMappingURL=index.js.map