const Book = require("../models/book.model");
const User = require("../models/user.model");


exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.rentBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ message: "User or Book not found" });
    }

    if (user.rentedBooks.includes(bookId)) {
      return res.status(400).json({ message: "Book already rented by this user" });
    }

    user.rentedBooks.push(bookId);
    book.rentedBy.push(userId);

    await user.save();
    await book.save();

    res.status(200).json({ message: "Book rented successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.returnBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      return res.status(404).json({ message: "User or Book not found" });
    }
    
    user.rentedBooks = user.rentedBooks.filter(id => id.toString() !== bookId);
    book.rentedBy = book.rentedBy.filter(id => id.toString() !== userId);

    await user.save();
    await book.save();

    res.status(200).json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getBookRenters = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate("rentedBy", "name email");
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) return res.status(404).json({ message: "Book not found" });

    await User.updateMany(
      { rentedBooks: bookId },
      { $pull: { rentedBooks: bookId } }
    );

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
