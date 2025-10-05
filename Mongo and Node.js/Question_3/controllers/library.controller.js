const LibraryModel = require('../models/libraray.model');

const addBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    const book = await LibraryModel.create({ title, author, status: 'available' });
    return res.status(201).json({ msg: 'Book added', data: book });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};



const borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { borrowerName } = req.body;

    const book = await LibraryModel.findById(id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.status === 'borrowed') return res.status(409).json({ msg: 'Book already borrowed' });

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    book.status = 'borrowed';
    book.borrowerName = borrowerName;
    book.borrowDate = borrowDate;
    book.dueDate = dueDate;
    await book.save();

    return res.status(200).json({ msg: 'Book borrowed', data: book });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await LibraryModel.findById(id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.status !== 'borrowed') return res.status(409).json({ msg: 'Book is not currently borrowed' });

    const returnDate = new Date();
    book.returnDate = returnDate;

    
    let overdueFees = 0;
    if (book.dueDate && returnDate > book.dueDate) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const diffMs = returnDate - book.dueDate;
      const daysLate = Math.floor(diffMs / msPerDay);
      overdueFees = daysLate * 10; 
    }

    book.overdueFees = overdueFees;
    book.status = 'available';
    book.borrowerName = null;
    book.borrowDate = null;
    book.dueDate = null;

    await book.save();
    return res.status(200).json({ msg: 'Book returned', overdueFees, data: book });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


const getBooks = async (req, res) => {
  try {
    const { status, title } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (title) filter.title = new RegExp(title, 'i');

    const books = await LibraryModel.find(filter);
    return res.status(200).json({ msg: 'Books retrieved', count: books.length, data: books });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await LibraryModel.findById(id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.status === 'borrowed') return res.status(409).json({ msg: 'Cannot delete a borrowed book' });

    await LibraryModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: 'Book deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

module.exports = {
  addBook,
  borrowBook,
  returnBook,
  getBooks,
  deleteBook
};
