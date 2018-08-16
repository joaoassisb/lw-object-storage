'use strict';

const rp = require('request-promise');
const parseString = require('xml2js').parseString;
require('aws4');

module.exports = function ObjectStorage(bucketName, key, secret) {
	const aws = {
		key,
		secret
	};

	return {
		store(objectName, content) {
			return rp.put({
				aws,
				url: `https://lss.locaweb.com.br/${bucketName}/${objectName}`,
				body: content
			});
		},
		storeFile(fileName, buffer) {
			return this.store(fileName, buffer.toString("base64"))
		},
		get(objectName) {
			return rp.get({
				json:true,
				aws,
				url: `https://lss.locaweb.com.br/${bucketName}/${objectName}`,
			})
		},
		getFile(fileName) {
			return this.get(fileName).then((content) => {
				return new Buffer(content, "base64");
			})
		},
		remove(objectName) {
			return rp.delete({
				aws,
				url: `https://lss.locaweb.com.br/${bucketName}/${objectName}`
			});
		},
		list() {
			return rp.get({
				aws,
				url: `https://lss.locaweb.com.br/${bucketName}`
			});
		},
		removeAllObjects() {
			return this.list()
				.then((res) => promiseParseString(res))
				.then((xml) => {
					return Promise.all(xml.ListBucketResult.Contents.map((foto) => {
						return this.remove(foto.Key)
					}))
				})
		}
	};
};

function promiseParseString(string)
{
	return new Promise(function(resolve, reject)
	{
		parseString(string, function(err, result) {
			if (err) {
				return reject(err);
			 } else {
				return resolve(result);
			 }
		});
	});
}

