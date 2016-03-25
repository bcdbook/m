var marked = require("marked");

exports.toMarkdown = function(req, res) {
	// console.log('jjj');
	res.render('editor/markdown', {
		title: "首页"
	});
}
exports.markdown = function(req, res) {
	var val = req.body.markval || '';

	var imarkedval = marked(val);
	console.log(imarkedval);
	// console.log(req.body.markval);
	res.json({
		code: 200,
		msg: {
			url: '解析excel完成'
		},
		imarkedval: imarkedval
	});
}