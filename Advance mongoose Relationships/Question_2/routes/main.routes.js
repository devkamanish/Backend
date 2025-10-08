const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const bookController = require("../controller/book.controller");


router.post("/add-user", userController.addUser);
router.get("/user-rentals/:userId", userController.getUserRentals);


router.post("/add-book", bookController.addBook);
router.post("/rent-book", bookController.rentBook);
router.post("/return-book", bookController.returnBook);
router.get("/book-renters/:bookId", bookController.getBookRenters);
router.put("/update-book/:bookId", bookController.updateBook);
router.delete("/delete-book/:bookId", bookController.deleteBook);

module.exports = router;
