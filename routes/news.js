const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const News = mongoose.model('News');
class NewsClass {
	constructor(title, source, keywords, date) {
		this._title = title;
		this._source = source;
		this._keywords = keywords;
		this._date = date;
	}
	get title() {
		return this._title;
	}
	set title(value) {
		this._title = value;
	}
	get source() {
		return this._source;
	}
	set source(value) {
		this._source = value;
	}
	get keywords() {
		return this._keywords;
	}
	set keywords(value) {
		this._keywords.push(value.toLowerCase());
	}

	get date() {
		return this._date;
	}

	set date(value) {
		this._date = value;
	}

	toObject(){
		const toReturn = {};
		if (this.title) {toReturn.title = this.title;}
		if (this.source) {toReturn.source = this.source;}
		if (this.keywords) {toReturn.keywords = this.keywords;}
		if (this.date) {toReturn.date = this.date;}
		return toReturn;
	}
}
router.use(express.urlencoded({ extended: false }));

router.get('/', (req, res) => {
	const regexSearchOptions = new NewsClass();
	if (req.query.titleFilter){
		regexSearchOptions.title = {"$regex": req.query.titleFilter};
	}
	if (req.query.sourceFilter){
		regexSearchOptions.source = {"$regex": req.query.sourceFilter};
	}
	if (req.query.keywordsFilter){
		regexSearchOptions.keywords = {"$regex": req.query.keywordsFilter};
	}
	const toFind = regexSearchOptions.toObject();
	News.find(toFind, (err, varToStoreResult, count) => {
		if (err){
			console.log(err);
		}
		res.render('news', {ns: varToStoreResult});
	});
});


router.post('/', (req, res) => {
	//console.log(req.body);
	const newNews = new NewsClass();
	newNews.title = req.body.newsTitleAdd;
	newNews.source = req.body.mediaAdd;
	newNews.keywords = req.body.keywordsAdd;
	newNews.date = req.body.newsDateAdd;
	const newsAdd = new News(newNews.toObject());
	newsAdd.save(function(err, ns, count){
		if (err){
			console.log(err);
		}
		res.redirect('/news');
	});
});
router.post('/delete', (req, res) => {
	const deleteRow = {};
	deleteRow["title"] = req.body.checkbox;
	News.deleteMany(deleteRow, function (err) {
		if (err) {console.log(err);}
		res.redirect('/news');
	});
});


module.exports = router;
