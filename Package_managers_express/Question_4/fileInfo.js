const path = require("path");

function getFileInfo(filepath) {
  return {
    fileName: path.basename(filepath),
    extenstion: path.extname(filepath),
    directory: path.dirname(filepath),
  };
}

module.exports = getFileInfo;
