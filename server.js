const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const cloudinary = require('cloudinary')
const multer = require('multer')
require('dotenv').config()

var db, collection;

const url = process.env.MONGODB_URL;
const dbName = "personalexpress";


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET 
  });

  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images")
    }
  })

  const multerUploads = multer({ storage: fileStorage }).single('url');

app.listen(8100, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('catpics').find().toArray((err, result) => {
        if (err) return console.log(err)
        //console.log(result)
        res.render('index.ejs', { images: result })
    })
})

app.post('/addcat', multerUploads,async (req, res) => {
    try{
    console.log(req.body)
    console.log(req.file, 'file pleaseeeee')
    let photo = await cloudinary.uploader.upload(req.file.path, function(error, result) {console.log(result, error)});
    console.log(photo, 'photo')
    db.collection('catpics').insertOne({
        catName: req.body.catName,
        imgurl: photo.url,
        available: true
    }, console.log('saved to database'),
        (err, result) => {
            if (err) return console.log(err)
            res.redirect('/')
        })
    }
    catch (err) {
        console.log(err);
      }
})


app.put('/adoptCat', (req, res) => {
    console.log(typeof(req.body.catName), typeof(req.body.img))
    db.collection('catpics')
        .findOneAndUpdate({ imgurl: req.body.img}, {
            $set: {
                available: false
            }
        }, {
            sort: { _id: -1 },
            upsert: false
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        })
})

app.delete('/adoptCat', (req, res) => {
    db.collection('catpics').findOneAndDelete({imgurl: req.body.img}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })