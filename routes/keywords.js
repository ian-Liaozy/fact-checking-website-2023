const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Keyword = mongoose.model('Keyword');

router.get('/', (req, res) => {
	Keyword.find({}).then(function(varToStoreResult){
		res.render('keywords', {kw: varToStoreResult, kwArr: [['foo', 12], ['bar', 6]]});
	})
});
	// .sort({"total_count":-1});});
module.exports = router;
