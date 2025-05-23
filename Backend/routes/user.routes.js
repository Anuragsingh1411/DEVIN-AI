import { Router } from "express";
import * as userController from "../controllers/user.controllers.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();



router.post('/register', 
    body('email').isEmail().withMessage('Email is required'),
    body('password').isLength({min: 3}).withMessage('Password must be at least 3 characters long'),

    userController.createUser
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Email is required"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),

  userController.loginUser
);

router.get(
  "/profile",
  authMiddleware.authUser,
  userController.profileController
);

router.get(
  "/logout",
  authMiddleware.authUser,
  userController.logoutController
);

router.get('/all', authMiddleware.authUser, userController.getAllUsers);

export default router;
