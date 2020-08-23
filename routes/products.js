const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Product = require('../models/product')
const Author = require('../models/author')
const uploadPath = path.join('public', Product.coverImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png','image/jpg']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Products Route
router.get('/', async (req, res) =>{
    res.send('All Products')
})

// New Product Route
router.get('/new', async (req, res) => { 
    renderNewPage(res, new Product())
})
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const product = new Product({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        publishDate: new Date(req.body.publishDate),
        description: req.body.description,
        coverImageName: fileName
    })
    try {
        const newProduct = await product.save()
        res.redirect(`products`)
    } catch {
        if(product.coverImageName != null){
            removeProductCover(product.coverImageName)
        }
        renderNewPage(res, product, true) 
        console.log(products)
    }
})

function removeProductCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if(err) console.err()
    })
}

async function renderNewPage(res, product, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {authors: authors, product: product}
        if(hasError) params.errorMessage = 'Error creating Product'
        res.render('products/new', params)
    } catch{
        res.redirect('/products')
    }
}

module.exports = router