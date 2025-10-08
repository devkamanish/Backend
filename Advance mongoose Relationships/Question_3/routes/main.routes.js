const express = require("express");
const BookModel = require("../models/book.model");
const MemberModel = require("../models/member.model");
const router = express.Router();

router.post("/add-book", async (req, res) => {
  try {
    let newBook = new BookModel(req.body);
    await newBook.save();
    res.status(201).json({ msg: "Book created", newBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add-member", async (req, res) => {
  try {
    let newUser = new MemberModel(req.body);
    await newUser.save();
    res.status(201).json({ msg: "Member created", newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/borrow-book", async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const member = await MemberModel.findById(memberId);
    const book = await BookModel.findById(bookId);
    if (!member || !book) {
      return res.status(404).json({ message: "Member or book not found" });
    }

    if (book.status == "borrowed") {
      return res.status(400).json({ msg: "Book already borrowed" });
    }

    member.borrowedBooks.push(bookId);
    book.borrowers.push(memberId);
    book.status = "borrowed";

    await member.save();
    await book.save();
    res.status(200).json({ msg: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/return-book", async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    const member = await MemberModel.findById(memberId);
    const book = await BookModel.findById(bookId);

    if (!member || !book) {
      return res.status(404).json({ message: "Member or Book not found" });
    }

    member.borrowedBooks = member.borrowedBooks.filter(
      (id) => id.toString() !== bookId
    );
    book.borrowers = book.borrowers.filter((id) => id.toString() !== memberId);
    book.status = "available";

    member.save();
    book.save();
    res.status(200).json({ msg: "Book returned scuccessfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/member-borrowed-books/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await MemberModel.findById(memberId).populate(
      "borrowedBooks",
      "title author status -_id"
    );

    if (!member) {
      return res.status(404).json({ msg: "Member not found" });
    }
    res
      .status(200)
      .json({ member: member.name, borrowedBooks: member.borrowedBooks });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/book-borrowers/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await BookModel.findById(bookId).populate(
      "borrowers",
      "name email -_id"
    );
    if (!book) {
      return res.status(404).json({ msg: "book not found" });
    }
    res.status(200).json({
      book: book.title,
      borrowers: book.borrowers,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/update-book/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, status } = req.body;

    const updatedBook = await BookModel.findByIdAndUpdate(
      bookId,
      { title, author, status },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/delete-book/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    let book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ msg: "book not found" });
    }
    await MemberModel.updateMany({}, {$pull:{borrowedBooks:bookId}});
    await book.deleteOne();

    res.json({
      message: "Book deleted successfully and removed from members.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
