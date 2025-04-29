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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});