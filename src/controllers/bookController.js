const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const moment = require("moment")
const mongoose=require("mongoose")
const ObjectId = mongoose.Types.ObjectId

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}


const createBook = async  (req, res)=> {
    try {
        const bookBody = req.body
        if(Object.keys(bookBody) == 0) {
            return res.status(400).send({status: false, message: 'bookDetails must be provided'})
        }

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookBody
        
         //----------------------------------------------------------------------------------------titleValidation
        if(!isValid(title)) {
            return res.status(400).send({status: false, message: 'title is required'})
        }

         let duplicateTitle = await bookModel.findOne({title:title})
         
         if(duplicateTitle) {
            return res.status(400).send({status: false, message: 'title alredy exists'})
        }
         
         //----------------------------------------------------------------------------------------excerptValidation
        if(!isValid(excerpt)) {
            return res.status(400).send({status: false, message: 'excerpt is required'})
        }
        
        //----------------------------------------------------------------------------------------userIdValidation
        if(!isValid(userId)) {
            return res.status(400).send({status: false, message: 'userId is required'})
        }

        const userNotInDB = await userModel.findById(userId) 

        if(!userNotInDB) {
            return res.status(400).send({status:false, msg: `${userId} not in DB `})
        }
        
        //----------------------------------------------------------------------------------------ISBNValidation
        if(!isValid(ISBN)) {
            return res.status(400).send({status: false, message: 'ISBN is required'})
        }
        
          //isbn validation//   will try

        let duplicateISBN = await bookModel.findOne({ISBN:ISBN})
         
         if(duplicateISBN) {
            return res.status(400).send({status: false, message: 'ISBN alredy exists'})
        }

        //----------------------------------------------------------------------------------------categoryValidation
        if(!isValid(category)) {
            return res.status(400).send({status: false, message: 'category is required'})
        }
        //----------------------------------------------------------------------------------------subcategoryValidation
        if(!isValid(subcategory)) {
            return res.status(400).send({status: false, message: 'subcategory is required'})
        }
        //----------------------------------------------------------------------------------------reviewsValidation
        if(!isValid(reviews)) {
            return res.status(400).send({status: false, message: 'reviews is required'})
        }
        //----------------------------------------------------------------------------------------releasedAtValidation
        if(!isValid(releasedAt)) {
            return res.status(400).send({status: false, message: 'releasedAt is required'})
        }

        if(!/^\d{4}-\d{2}-\d{2}$/.test(bookBody.releasedAt)) {
            return res.status(400).send({status: false, message: 'Invalid date format'})
        }


        //---------------------------------------------------------------------------------------------bookCreation
        const newBook = await bookModel.create(bookBody)
            return res.status(201).send({ status:true, data:newBook, msg: "book created successfully"})

    }
    catch(error) {
        return res.status(500).send({status: false, error: error.message})
    }
}



const getBooks=async function(req,res){

    try{
         const queryParams=req.query
        let filterQuery={isDeleted:false,deletedAt:null}
        let {userId, category,subcategory}=queryParams

            
            if (userId) {
                
                filterQuery.userId = userId
            }
                      
            if (category) {
                //filterQuery["category"] = category
                filterQuery.category = category
            }

            if (subcategory) {
                //filterQuery["subcategory"] = subcategory
                filterQuery.subcategory = subcategory
            }

            let book = await bookModel.find(filterQuery)
            const book1 = await bookModel.find(filterQuery).select({ "_id": 1, "title": 1, "excerpt": 1, "userId": 1 ,"category":1,"releasedAt":1,"reviews":1 }).sort({"title":1})
	          
            if (book.length > 0) {
              res.status(200).send({ status: true,count: book.length,message:'Books list', data: book1 })
            }
           
            else {
              res.status(404).send({ msg: "book not found" })
            }
          
    }catch(error){
        res.status(500).send({status:true,message:error.message})
    }

}

const getBookById = async function(req,res){
    try{
       const bookParams = req.params.bookId

       //validating bookId after accessing it from the params.

       if (!isValidObjectId(bookParams)) {
           return res.status(400).send({ status: false, message: "Inavlid bookId." })
       }

       //Finding the book in DB by its Id & an attribute isDeleted:false

       const findBook = await bookModel.findOne({_id: bookParams,isDeleted: false })
       if (!findBook) {
           return res.status(404).send({ status: false, message: `Book does not exist or is already been deleted for this ${bookParams}.` })
       }

       //Checking the authorization of the user -> Whether user's Id matches with the book creater's Id or not.

       if (findBook.userId != req.userId) {
           return res.status(401).send({status: false, message: "Unauthorized access."})
       }

       //Accessing the reviews of the specific book which we got above, -> In reviewsData key sending the reviews details of that book.
       const fetchReviewsData = await reviewModel.find({ bookId: bookParams, isDeleted: false }).select({ deletedAt: 0, isDeleted: 0, createdAt: 0, __v: 0, updatedAt: 0 }).sort({reviewedBy: 1})

       let reviewObj = findBook.toObject()
       if (fetchReviewsData) {
           reviewObj['reviewsData'] = fetchReviewsData
       }

       return res.status(200).send({ status: true, message: "Book found Successfully.", data: reviewObj })
    }catch(err){
       return res.status(500).send({status:false,msg: err.message})

   }
}


const updateBook = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (userId != req.userId) {
            return res.status(403).send({status: false, message: "Unauthorized access ! User's credentials doesn't match."})
        };
        let { title, excerpt, releasedAt, ISBN } = req.body
        if (!(title || excerpt || releasedAt || ISBN)) {
            return res.status(400).send({ status: false, msg: "required data should be title ,excerpt,date ,ISBN" })
        }
        let dupBook = await bookModel.findOne({ title: title, ISBN: ISBN })
        if (dupBook) {
            return res.status(400).send({ status: false, msg: "this title and ISBN already updated" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId is required" })
        }
        if (!ObjectId.isValid(bookId.trim())) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
        if (!/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt)) {
            return res.status(400).send({ status: false, msg: "this data format /YYYY-MM-DD/ accepted " })

        }
        let updateBookData = { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN }
        let updated = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $set: updateBookData }, { new: true })
        if (!updated) {
            return res.status(404).send({ status: false, msg: "data not found " })
        }
        return res.status(200).send({ status: true, data: updated })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

  

module.exports.createBook=createBook
module.exports.getBooks=getBooks
module.exports.updateBook=updateBook
module.exports.getBookById=getBookById