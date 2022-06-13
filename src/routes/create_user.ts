import express from "express";
import { User } from "../entities/user";
import bcrypt from "bcrypt";
import _ from "lodash";
import { validate } from "class-validator";
import passwordComplexity from "joi-password-complexity";
import { auth } from "../middleware/auth";
import { Role } from "../entities/role";
import Express from "express";
import { admin } from "../middleware/admin";

const PERMISSION_DENIED: string = "Permission denied";

const router = express.Router();
const complexityOptions = {
  min: 5,
  max: 15,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

router.get("/api/user/me", auth, async (req, res) => {
  const user = (req as any).user;
  const currentUser = await User.findOneBy({
    id: user.id,
  });

  if (!currentUser) {
    return res.status(400).send("There is no user with given id");
  }

  return res.status(200).send(currentUser.getUserInfos());
});

router.get("/api/users", auth, async (req, res) => {
  const user = (req as any).user;
  const role: Role = <Role>(user as any).role;
  if (role === Role.Admin) {
    const allUsers = await User.find();
    return res.status(200).send(allUsers.map((data) => data.getUserInfos()));
  }

  return res.status(403).send(PERMISSION_DENIED);
});

router.get("/api/user/:id", auth, async (req, res) => {
  const currentUser = (req as any).user;
  const role: Role = <Role>(currentUser as any).role;
  if (role === Role.Admin) {
    const userId = req.params.id as any;
    if (!userId) {
      const user = await User.findOneBy({
        id: userId,
      });

      if (!user && user != null) {
        return res.status(200).send((<User>user).getUserInfos());
      } else {
        return res.status(404).send("There is no user with the given id");
      }
    } else {
      return res.status(400).send("You need to provide user id as parameter");
    }
  } else {
    return res.status(403).send(PERMISSION_DENIED);
  }
});

router.get("/api/user/teachers", auth, async (req, res) => {
  loadDataByRole(req, res, Role.Teacher);
});

router.get("/api/user/students", auth, async (req, res) => {
  loadDataByRole(req, res, Role.Student);
});

router.get("/api/user/admins", auth, async (req, res) => {
  loadDataByRole(req, res, Role.Admin);
});

async function loadDataByRole(
  req: Express.Request,
  res: Express.Response,
  role: Role
) {
  const currentUser = (req as any).user;
  const currentUserRole: Role = <Role>(currentUser as any).role;
  if (currentUserRole === Role.Admin) {
    const users = await User.findBy({
      role: role,
    });
    return res.status(200).send(users.map((data) => data.getUserInfos()));
  }
  return res.status(403).send(PERMISSION_DENIED);
}

router.post("/api/user", auth, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  //const user = User.create(_.pick(req.body, ['password', 'firstName', 'lastName', 'email']));
  const user = User.create({
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email,
  });

  const errors = await validate(user);
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }

  //TODO: Activate strong password
  //const validatPwdComplexity = passwordComplexity(complexityOptions).validate("aPassword123!");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  try {
    await user.save();
  } catch (ex: any) {
    return res.status(400).send(ex.message);
  }
  return res
    .header("x-auth-token", user.generateAuthToken())
    .status(200)
    .send(user.getUserInfos());
});

router.put(
  "/api/user/:id",
  [auth, admin],
  async (req: Express.Request, res: Express.Response) => {
    const userId = req.params.id as any;
    if (!userId) {
      const user = await User.findOneBy({
        id: userId,
      });

      if (!user && user != null) {
        const updatedUserInfos = await User.merge(user, req.body);
        return res
          .status(200)
          .send(
            _.pick(updatedUserInfos,  User.standardFilterArray)
          );
      } else {
        return res.status(400).send("There is no user with given id");
      }
    } else {
      return res.status(400).send("You need to provide user id as parameter");
    }
  }
);

router.put("/api/user/me", auth, async (req, res) => {
  const user = (req as any).user;
  const currentUser = await User.findOneBy({
    id: user.id,
  });

  if (!currentUser) {
    return res.status(400).send("There is no user with given id");
  }
  const updatedUserInfos = await User.merge(currentUser, req.body);
  return res.status(200).send(
    _.pick(updatedUserInfos,  User.standardFilterArray)
  );
});

export { router as createUserRoute };
