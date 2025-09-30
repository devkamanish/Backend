const express = require("express");
const fs = require("fs");
const app = express();

const DB_FILE = "./db.json";

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data), "utf-8");
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Books Store</h1>");
});

app.post("/books", (req, res) => {
  let newBook = req.body;

  let data = readDb();
  let books = data.books;
  let id = books.length + 1;
  newBook = { id, ...newBook };
  books.push(newBook);
  writeDb(data);
  res.status(201).json(newBook);
});
app.get("/books", (req, res) => {
  let data = readDb();
  res.status(200).json(data.books);
});

app.get("/books/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = readDb();
  let books = data.books;

  let index = books.findIndex((b) => b.id === id);
  if (index == -1) {
    res.status(404).json({ msg: "Book not found" });
  } else {
    books.forEach((ele) => {
      if (ele.id == id) {
        res.status(200).json({ msg: "Book details", dish: ele });
      }
    });
  }
});

app.put("/books/:id", (req, res) => {
  let data = readDb();
  let books = data.books;

  let id = Number(req.params.id);
  let index = books.findIndex((b) => b.id === id);
  if (index == -1) {
    res.status(404).json({ msg: "Book not found" });
  } else {
    let updatedBook = books.map((ele) => {
      if (ele.id == id) {
        return { ...ele, ...req.body };
      } else {
        return ele;
      }
    });
    data.books = updatedBook;
    writeDb(data);
    res.status(200).json({ msg: "Book updated successfully" });
  }
});

app.delete("/books/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = readDb();
  let books = data.books;
  let index = books.findIndex((b) => b.id === id);
  if (index == -1) {
    res.json({ msg: "Book not found" });
  } else {
    let filteredBooks = books.filter((ele) => ele.id !== id);
    data.books = filteredBooks;
    writeDb(data);
    res.status(200).json({ msg: `Book with id: ${id} deleted successfully` });
  }
});

app.get("/books/search", (req, res) => {
  const data = readDb();
  const books = data.books;
  const { author, title } = req.query;

  let results = books;

  if (author) {
    results = results.filter(b =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  if (title) {
    results = results.filter(b =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (results.length > 0) {
    res.json(results);
  } else {
    res.status(404).json({ msg: "No books found" });
  }
});

app.use((req, res) => {
  res.json({ msg: "Requested route is not present" });
});

app.listen(8000, () => {
  console.log(`Server running on http://localhost:8000/`);
});
