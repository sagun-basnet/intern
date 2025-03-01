import express from "express";
import { users,getUserId,getAllUsers,updateUser,deleteUser} from "../controller/user.js";


const route= express.Router();
route.post("insertUser",users)
route.get("/getUserId/:id", getUserId);
route.get("/users", getAllUsers);   
route.put("/users/:id", updateUser);   
route.delete("/users/:id", deleteUser);

export default route;