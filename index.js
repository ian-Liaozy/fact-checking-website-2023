const express = require('express')
const path = require('path');


const app = express()
const routes = require('./routes/idx.js');
const keywords = require('./routes/keywords.js');
const news = require('./routes/news.js');
const session = require('express-session');

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

const sessionOptions = {
  secret: 'secret cookie thang (store this elsewhere!)',
  resave: true,
  saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))

app.use('/', routes);
app.use('/search', routes);
app.use('/keywords', keywords);
app.use('/news', news);

const port = process.env.PORT || 8080

app.listen(port, (err, res) => {
    if (err) {
        console.log(err)
        return res.status(500).send(err.message)
    } else {
        console.log('[INFO] Server Running on port:', port)
    }
})
