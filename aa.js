const phantom=require('phantom');
(async function(){
	let instance=await phantom.create(['--ignore-ssl-errors=yes']);
	let page=await instance.createPage();
	await page.on('onResourceRequested',function(requestData) {
		console.info('Requesting',requestData.url);
	});
	let status=await page.open('https://www.baidu.com/');
	if(status=='success'){
		await page.evaluate(function() {
			return document.title;
		}).then(function(html){
			console.log(html);
		});
		//content,plainText,cookies,title,url
		const content=await page.property('content');
		console.log(content);
	}
	await instance.exit();
})();