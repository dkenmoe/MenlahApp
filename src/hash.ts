import bcrypt from "bcrypt";

async function run() {
    const salt = await bcrypt.genSalt(10);
    
}