const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); 
const cookieParser = require('cookie-parser');
const i18n = require('i18n');
const app = express();
const searchRoutes = require('./routes/search');
const dummyApis = require('./routes/dummyApis');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());  // Ensure cookie-parser is loaded first

app.use(expressLayouts);
app.set('layout', 'layout');

// Update i18n configuration
i18n.configure({
    locales: ['en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu', 'ml', 'kn'],
    defaultLocale: 'en',
    cookie: 'lang',
    directory: path.join(__dirname, 'locales'),
    objectNotation: true,
    updateFiles: false
});
app.use(i18n.init);

// Add language middleware
app.use((req, res, next) => {
    const lang = req.cookies.lang || 'en';
    res.locals.currentLocale = lang; // Make locale available to all views
    res.locals.availableLocales = i18n.getLocales();
    req.setLocale(lang);
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes first
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

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
      maxAge: 900000, 
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

// Helper function to translate property fields using req.__
function translateProperty(property, translator) {
  // Update only the fields that need translation
  property.state = translator(property.state);
  property.district = translator(property.district);
  property.subDistrict = translator(property.subDistrict);
  property.cityOrVillage = translator(property.cityOrVillage);
  // For encumbrances
  if (Array.isArray(property.encumbrances)) {
    property.encumbrances = property.encumbrances.map(e => translator(e));
  }
  return property;
}

// Example route for displaying results
app.get('/results', (req, res, next) => {
  let results = require('./data/DLRData.json');
  // Translate each property before rendering
  results = results.map(prop => translateProperty(prop, req.__));
  res.render('results', { results: results, locale: req.locale, __: req.__ });
});

// Update /showProperty route similarly
app.get('/showProperty', (req, res) => {
  const propertyId = req.query.propertyId;
  const cersaiData = require('./data/CERSAIData.json');
  const dlrData = require('./data/DLRData.json');
  let property = cersaiData.find(p => p.propertyId === propertyId);
  if (!property) {
    property = dlrData.find(p => p.propertyId === propertyId);
  }
  // Apply translation if property is found
  if (property) {
    property = translateProperty(property, req.__);
  }
  res.render('showProperty', { property: property, locale: req.locale, __: req.__ });
});

app.use('/', searchRoutes);

// Mount the mock API endpoints under /api/mock
const mockApis = require('./routes/mockApis');
app.use('/api/mock', mockApis);

// Mount dummy API routes under /api, so the endpoints are:
// /api/doris, /api/dlr, /api/cersai, /api/mca21
app.use('/api', dummyApis);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});