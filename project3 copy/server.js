// imports express library
const express = require('express')
const parser = require('body-parser')
const encodedParser = parser.urlencoded({extended: true})
const multer = require('multer')
const uploadProcessor = multer({dest:'public/upload'})
const fs = require('fs'); 
const path = require('path'); 

const app = express()


const publicInfoPath = path.join(__dirname, 'publicInfo.json');
const publicDataPath = path.join(__dirname, 'publicData.json');
const contact = path.join(__dirname, 'contact.json');

function loadData(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return [];
}

function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


app.use(express.static('public'))
app.use(encodedParser)
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.get('/',(req,res)=>{
    res.render("index.ejs",{addSec:0})
})
app.get('/event',(req,res)=>{
    res.render("event.ejs",{addSec:1})
})

function clearData(filePath, dataArray) {
    dataArray.length = 0;
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}
//clear everything
app.get('/clear-data', (req, res) => {
    clearData(publicInfoPath, publicInfo); 
    clearData(publicDataPath, publicData); 

    console.log('publicInfo and publicData have been cleared.');

    res.send('All data has been cleared.');
});



let publicInfo = [];

app.post('/upload-text', (req, res) => {
    const { title, poweredBy, uploadedBy, imagePath } = req.body;

    if (!imagePath) {
        return res.status(400).json({ 
            success: false, 
            message: 'No image path provided.' 
        });
    }

    const uploadTime = new Date().toLocaleString();
    const imageInfo = {
        title,
        poweredBy,
        uploadedBy,
        imagePath,
        uploadTime
    };

    publicInfo.push(imageInfo);
    saveData(publicInfoPath, publicInfo);

    console.log('Uploaded text info:', imageInfo);

    res.status(200).json({ 
        success: true, 
        message: 'Text information uploaded successfully.' 
    });
});

let publicData = []
let publicNum =[]
let index=-1;
app.get('/gallery',(req,res)=>{
    let addSec = 1;
    res.render('gallery.ejs',{addSec, publicInfo,publicData})
    console.log(publicInfo);
    console.log(publicData);
})

let data = []
let postNum =[]
app.post('/upload', (req, res) => {
    const message = {
        text: req.body.text,
    };

    data.push(message);
    console.log('New contact:', message);

    saveData(contact, data);

    
    res.status(200).json({ 
        success: true, 
        message: 'Contact saved successfully.' 
    });
});




app.post('/upload-image', uploadProcessor.single('theimage'), (req, res) => {
    index++;

    const message = {
        index: index,
        imgSrc: req.file ? 'upload/' + req.file.filename : null
    };

    if (req.file) {
        publicData.push(message);
        saveData(publicDataPath, publicData); 

        console.log('Image uploaded:', message);
        res.json({ success: true, imagePath: message.imgSrc });
    } else {
        res.status(400).json({ success: false, message: 'File upload failed.' });
    }
});

publicInfo = loadData(publicInfoPath);
publicData = loadData(publicDataPath);
// setting up the server to start
// LAST PIECE OF CODE
// for projects going forward, it CANNOT be 80
app.listen(5555, ()=> {
    console.log('server starts')
})

