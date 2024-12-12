const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const upload = multer({ dest: 'public/images/' });


const dbPath = path.join(__dirname, 'data', 'cats.txt');
const plantsDbPath = path.join(__dirname, 'data', 'plants.txt');

// load cat data
function loadCats() {
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf8');
    return data ? JSON.parse(data) : [];
  }
  return [];
}

function saveCats(cats) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(cats, null, 2));
  } catch (err) {
    console.log(err);
  }
}

// Home Page
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Garden Page
app.get('/garden', (req, res) => {
  const cats = loadCats();
  const userIp = req.ip; // IP
  res.render('garden.ejs', { cats, userIp });
});

app.post('/update-fish', (req, res) => {
  const { catNumber } = req.body;


  const cats = loadCats();

  
  const cat = cats.find(c => c.number === parseInt(catNumber));
  if (cat) {
      // Check if this user has already liked the cat
      if (!cat.likedUsers) {
          cat.likedUsers = []; 
      }

      const userId = req.ip; // Use IP as a unique identifier for simplicity

      if (cat.likedUsers.includes(userId)) {
          return res.status(400).json({ success: false, message: 'You already liked this cat!' });
      }

      cat.likedUsers.push(userId); 
      cat.fish = (cat.fish || 0) + 1; // Increase the fish count
      saveCats(cats); 

      res.status(200).json({ success: true, fish: cat.fish });
  } else {
      res.status(404).json({ success: false, message: 'Cat not found' });
  }
});

// Create Cat Page
app.get('/create-cat', (req, res) => {
  res.render('create-cat.ejs');
});

// Save New Cat
app.post('/save-cat', upload.single('contentImage'), (req, res) => {
  const { content } = req.body; 
  const cats = loadCats();


  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;


  const newCat = {
    number: cats.length + 1,
    content: `${content}\n(${formattedDate})`, 
    pattern: 1,
    color: 1,
    pose: 1,
    bell: 1,
    sound: 1,
    image: req.file ? `/images/${req.file.filename}` : null, 
  };

  cats.push(newCat); 
  saveCats(cats); 
  res.redirect(`/customize-cat/${newCat.number}`);
});

// Customize Cat Page
app.get('/customize-cat/:id', (req, res) => {
  const cats = loadCats();
  const cat = cats.find((c) => c.number === parseInt(req.params.id));
  if (cat) {
    res.render('customize-cat', { cat });
  } else {
    res.redirect('/garden');
  }
});

app.post('/update-cat/:id', (req, res) => {
  const { id } = req.params;
  const cats = loadCats();
  const cat = cats.find(c => c.number === parseInt(id));
  
  if (cat) {
    Object.assign(cat, req.body); 
    saveCats(cats); 
    res.status(200).send({ success: true });
  } else {
    res.status(404).send({ success: false, message: 'Cat not found' });
  }
});

function loadPlants(){
  const plantsFilePath = path.join(__dirname, 'data', 'plants.txt');

  if (fs.existsSync(plantsFilePath)) {
    const plantsData = fs.readFileSync(plantsFilePath, 'utf8');
    const plants = plantsData ? JSON.parse(plantsData) : [];
    return plants;
  } else {
    return []; 
  }
}

app.get('/load-plants', (req, res) => {
  const plantsFilePath = path.join(__dirname, 'data', 'plants.txt');

  if (fs.existsSync(plantsFilePath)) {
    const plantsData = fs.readFileSync(plantsFilePath, 'utf8');
    const plants = plantsData ? JSON.parse(plantsData) : [];
    res.json(plants);
  } else {
    res.json([]); 
  }
});

function savePlants(plants) {
  try {
    fs.writeFileSync(plantsDbPath, JSON.stringify(plants, null, 2));
    console.log('Plants saved successfully:', plants);
  } catch (err) {
    console.error('Error saving plants:', err);
  }
}

app.post('/save-plant', (req, res) => {
  console.log('Received Plant Data:', req.body);

  const { x, y, plant, index } = req.body;

  if (!x || !y || !plant || !index) {
    console.error('Invalid Plant Data:', req.body);
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }
  
  const plants = loadPlants();
  const newPlant = { x, y, plant, index };
  plants.push(newPlant);

  savePlants(plants);
  console.log('Plant Saved Successfully:', newPlant);
  res.status(200).json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
