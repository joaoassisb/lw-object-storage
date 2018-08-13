'use strict';

const rp = require('request-promise');

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
				body: content || undefined
			});
		},
		get(objectName) {
			return rp.get({
				aws,
				url: `https://lss.locaweb.com.br/${bucketName}/${objectName}`
			});
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
		}
	};
};
