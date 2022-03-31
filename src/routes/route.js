const express = require('express');
const router = express.Router();
const usercontroller=require("../controllers/userController")
const bookcontroller=require("../controllers/bookController")
const reviewcontroller=require("../controllers/reviewController")
const middleware=require("../authenticate/auth")





router.post("/createUser",usercontroller.createUser)
router.post("/login",usercontroller.userLogin)
router.post("/createBook",middleware.authenticate, bookcontroller.createBook)
router.get("/getBooks",bookcontroller.getBooks)
router.put("/updateBook/:bookId",bookcontroller.updateBook)
router.get("/getBookById",bookcontroller.getBookById)

router.post("/createReview/:bookId/review",reviewcontroller.createReview)
// router.put("/updateReview/:bookId/review/:reviewId",reviewcontroller.updateReview)
// router.delete("/deleteReview/:bookId/review/:reviewId",reviewcontroller.deleteReview)

module.exports=router;