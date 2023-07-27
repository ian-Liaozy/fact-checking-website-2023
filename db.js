const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');


const Keyword = new mongoose.Schema({
	keyword:  {type: String, required: true, unique : true},
	total_count: {type: Number, min: 0},
	true_count: {type: Number, min: 0},
	false_count: {type: Number, min: 0},
});


const News = new mongoose.Schema({
	title: {type: String, required: true},
	source: {type: String},
	keywords: { type : Array , "default" : [] }
});

let dbconf;
// if (process.env.NODE_ENV === 'PRODUCTION') {
// 	// if we're in PRODUCTION mode, then read the configration from a file
// 	// use blocking file io to do this...
// 	const fs = require('fs');
// 	const path = require('path');
// 	const fn = path.join(__dirname, 'config.json');
// 	const data = fs.readFileSync(fn);

// 	// our configuration file will be in json, so parse it and set the
// 	// conenction string appropriately!
// 	const conf = JSON.parse(data);
// 	dbconf = conf.dbconf;
// } else {
// 	// if we're not in PRODUCTION mode, then use
dbconf = 'mongodb+srv://zl3057:ian@cluster0.4usnwgg.mongodb.net/';
// }
// Keyword.plugin(passportLocalMongoose);
// News.plugin(URLSlugs('name'));

mongoose.model('Keyword', Keyword);
mongoose.model('News', News);
mongoose.connect(dbconf);
