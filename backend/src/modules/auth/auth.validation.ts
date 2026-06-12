import { body,param } from "express-validator";

export const registerValidator=[
    body("email").isEmail().withMessage("Invalid Email"),
    body("phoneNumber").isMobilePhone("en-IN").withMessage("Invalid phone number"),
    body("name").notEmpty().withMessage("Name is required").isString().withMessage("Name must be a string").isLength({ min: 4, max: 50 }).withMessage("Name must be between 4 and 50 characters")
    ]

export const setPasswordValidator=[
    body("password").isLength({min:6,max:15}).withMessage("Password length must be between 6 to 15 characters").isStrongPassword({
        minLength:6,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1,
        minLowercase:1
    }).withMessage("Password must include uppercase, lowercase, number and symbol"),
    param("token").isString().withMessage("token not found")
]    

export const loginValidator=[
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email format"),
    body("password").notEmpty().withMessage("Password is required")
]

export const changePasswordValidator=[
    body("oldPassword").notEmpty().withMessage("old password is required"),
    body("newPassword").isLength({min:6,max:15}).withMessage("Password length must be between 6 to 15 characters").isStrongPassword({
        minLength:6,
        minUppercase:1,
        minSymbols:1,
        minNumbers:1,
        minLowercase:1
    }).withMessage("Password must include uppercase, lowercase, number and symbol")
]

export const forgetPasswordValidator=[
    body("email").isEmail().withMessage("Invalid Email")
]