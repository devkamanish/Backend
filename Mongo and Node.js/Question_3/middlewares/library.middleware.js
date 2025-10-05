const LibraryModel = require("../models/libraray.model");


const validationBookData = (req, res, next)=>{
    const {title, author} = req.body;
    if(!title || !author){
        return res.status(400).json({msg: "Incomplete Data: title and author required"})
    }
   next();
}


const borrowLimit = async(req ,res, next)=>{
    const {borrowerName } = req.body;
    if(!borrowerName) return res.status(400).json({msg : "Borrower name required"})

        try{
            const activeBorrows = await LibraryModel.countDocuments({
            borrowerName,
            status : "borrowed"
            });
            if( activeBorrows >=3){
                return res.status(409).json({msg : "Borrowing limit exceeds: max 3 books"})

            }
            next();
        }catch(err){
            next(err)
        }
}

module.exports = {
    validationBookData, 
    borrowLimit
}

