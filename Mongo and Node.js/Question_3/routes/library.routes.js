
const express = require("express")

const router = express.Router();

const controller = require("../controllers/library.controller")

const {borrowLimit, validationBookData} = require("../middlewares/library.middleware")


router.post("/books", validationBookData, controller.addBook)

router.patch('/borrow/:id', borrowLimit, controller.borrowBook);


router.patch('/return/:id', controller.returnBook);


router.get('/books', controller.getBooks);


router.delete('/books/:id', controller.deleteBook);

module.exports = router;