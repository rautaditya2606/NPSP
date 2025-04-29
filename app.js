const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); 
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const fs = require('fs');
const { combineData } = require('./data/transformData');
const app = express();
const searchRoutes = require('./routes/search');
const dummyApis = require('./routes/dummyApis');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());  // Ensure cookie-parser is loaded first

app.use(expressLayouts);
app.set('layout', 'layout');

i18n.configure({
    locales: ['hi', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'as', 'mai', 'sat', 'ks'],
    defaultLocale: 'en',
    cookie: 'lang',
    directory: path.join(__dirname, 'locales')
});
app.use(i18n.init);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (!req.cookies.lang && req.path === '/') {
        return res.redirect('/language');
    }
    next();
});

app.get('/', (req, res) => {
    res.render("language");
});

app.get('/language', (req, res) => {
    res.render('language');
});

app.get("/search", (req, res) => {
    res.render("index", { locale: req.getLocale() });
});

// Process language selection form, set cookie with path and redirect to /search
app.post('/set-language', (req, res) => {
    const language = req.body.language;
    res.cookie('lang', language, { 
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true, 
      path: '/',
      sameSite: 'Lax'
    });
    res.redirect('/search');
});

// Test route to verify translations
app.get('/test-translations', (req, res) => {
  res.send({
    locale: req.getLocale(),
    translation: res.__('Property Search')
  });
});

app.use('/', searchRoutes);

// Mount the mock API endpoints under /api/mock
const mockApis = require('./routes/mockApis');
app.use('/api/mock', mockApis);

// Mount dummy API routes under /api, so the endpoints are:
// /api/doris, /api/dlr, /api/cersai, /api/mca21
app.use('/api', dummyApis);

// Helper to load a JSON file from the data folder
function loadData(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

// Load all data sources from the data folder
const ruralData = loadData('ruralProperties.json');
const urbanData = loadData('urbanProperties.json');
const cersaiData = loadData('CERSAIData.json');
const mcaData = loadData('MCA21Data.json');

// Combine the data using the transformation functions
const unifiedData = combineData(ruralData, urbanData, cersaiData, mcaData);

// API to search by propertyId
app.get('/api/property/:propertyId', (req, res) => {
  const propertyId = req.params.propertyId;
  // Note: rural transform returns field "propertyId" while others use "property_id"
  const result = unifiedData.filter(item =>
    item.propertyId === propertyId || item.property_id === propertyId
  );
  if (result.length === 0) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json(result);
});

// API to search by registrationNumber
app.get('/api/registration/:registrationNumber', (req, res) => {
  const registrationNumber = req.params.registrationNumber;
  const result = unifiedData.filter(item =>
    item.registrationNumber === registrationNumber
  );
  if (result.length === 0) {
    return res.status(404).json({ error: 'Registration number not found' });
  }
  res.json(result);
});

// API to retrieve all property data
app.get('/api/properties', (req, res) => {
  res.json(unifiedData);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});