const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.txt");

function readFileData() {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("File not found. Creating a new one...");
        fs.writeFile(filePath, "", (err) => {
          if (err) console.error("Error creating file:", err);
        });
        return;
      }
      console.error("Error reading file:", err);
      return;
    }

    if (data.trim().length === 0) {
      console.log("File is empty.");
    } else {
      console.log(data);
    }
  });
}

function appendFileData() {
  const content = "This is Appended data\n";
  fs.appendFile(filePath, content, (err) => {
    if (err) {
      console.error("Error appending file:", err);
      return;
    }
    console.log("Appending data...");
  });
}

module.exports = { readFileData, appendFileData };
