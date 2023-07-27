const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose')

const Keyword = require('../db.js');
const News = require('../db.js');
// const fetch = require('node-fetch');

class KeywordClass {
    constructor(keyword, totalCount) {
        this._keyword = keyword;
        this._total_count = totalCount;
    }
    get keyword() {
        return this._keyword;
    }
    set keyword(value) {
        this._keyword = value;
    }
    get total_count() {
        return this._total_count;
    }
    set total_count(value) {
        this._total_count = value;
    }
    toObject(){
        const toReturn = {};
        if (this.keyword) {toReturn.keyword = this.keyword;}
        if (this.total_count) {toReturn.total_count = this.total_count;}
        return toReturn;
    }

}

// class NewsClass {
//     constructor(keyword, totalCount) {
//         this._keyword = keyword;
//         this._total_count = totalCount;
//     }
//     get keyword() {
//         return this._keyword;
//     }
//     set keyword(value) {
//         this._keyword = value;
//     }
//     get total_count() {
//         return this._total_count;
//     }
//     set total_count(value) {
//         this._total_count = value;
//     }
//     toObject(){
//         const toReturn = {};
//         if (this.keyword) {toReturn.keyword = this.keyword;}
//         if (this.total_count) {toReturn.total_count = this.total_count;}
//         return toReturn;
//     }

// }

async function SearchAPI(title, source, date){
    if (title === undefined && source === undefined){
        return {articles: [], count: 0};
    }
    const words = title.replace(' ', ' AND ');
    const key = '7d84e84cf9be4252a0f25e14d1349350';
    if (date === undefined){
        date = '2022-04-01';
    }
    const url = 'https://newsapi.org/v2/everything?' +
        `q=${words}&` +
        `from=${date}&` +
        'sortBy=popularity&' +
        'searchIn=title&' +
        `apiKey=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    const result = {articles: [], count: 0};
    await data.articles.forEach((news) => {
        if (source === '' || news.source.name.indexOf(source) > -1){
            result.articles.push({title: news.title, url: news.url, source: news.source.name, date: news.publishedAt.slice(0, 10)});
        }
    });
    // result.articles = data.articles;
    // result.articles.filter((news) =>
    //     news.source.name.indexOf(source) > -1
    // );
    result.count = data.totalResults;
    // console.log(data.totalResults);
    return result;
}


router.use(express.urlencoded({ extended: false }));

router.get('/', (req, res) => {

    res.redirect('/search');
});

router.get('/search',async (req, res) => {
    const data = await SearchAPI(req.query.newsTitle, req.query.media, req.query.newsDate);
    data.articles = data.articles.slice(0, 5);
    const query = {};
    query.title = req.query.newsTitle;
    query.source = req.query.media;
    query.date = req.query.newsDate;
    // console.log(query, req.query)
    if (query.title !== undefined){
        query.keywords = req.query.newsTitle.toLowerCase().replace(',', '').split(' ');
        const newsAdd = new News(query);
        
        // console.log('newsAdd', newsAdd);
        // newsAdd["Content-Type"] = 'application/json';
        // newsAdd.save();
        query.keywords.forEach((kw) => {
            // const kwQuery = {"keyword": kw};
            const kwNew = new KeywordClass(kw, 1);
            Keyword.find(kwNew.toObject()).then( (err, found) => {
                // console.log(found[0]);
                if (err){
                    console.log(err);
                }
                if (found === undefined || found[0] === undefined){
                    kwNew.total_count = 1;
                    const newKw = new Keyword(kwNew.toObject());
                    // newKw.save();
                }
                else {
                    const newCount = found[0]["total_count"] + 1;
                    Keyword.findOneAndUpdate({"keyword": kwNew.keyword}, {"total_count": newCount}, null, function (err, docs) {
                        if (err){
                            console.log(err);
                        }
                    });
                }
            });
        });
    }
    res.render('index', {'data': data});
});
router.post('/search', async (req, res) => {
    const title = req.body.kwToSearch;
    const data = await SearchAPI(title, '', undefined);
    data.articles = data.articles.filter((news, index) => index < 5);
    res.render('index', {'data': data});
});


module.exports = router;
