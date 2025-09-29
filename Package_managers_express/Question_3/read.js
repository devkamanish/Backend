
const fs = require('fs');

function readFileContent(filePath) {
    
        const data = fs.readFileSync("./data.txt", 'utf8');
        return data;
   
}

module.exports = readFileContent
 