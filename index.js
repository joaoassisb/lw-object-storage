"use strict";

const rp = require("request-promise");
const parseString = require("xml2js").parseString;
require("aws4");

module.exports = function ObjectStorage(defaultBucketName, key, secret) {
  const aws = {
    key,
    secret,
  };

  return {
    store(objectName, content, bucketName) {
      return rp.put({
        aws,
        url: `https://lss.locaweb.com.br/${
          bucketName || defaultBucketName
        }/${objectName}`,
        body: content,
      });
    },
    storeFile(fileName, buffer, bucketName) {
      return this.store(fileName, buffer.toString("base64"), bucketName);
    },
    get(objectName, bucketName) {
      return rp.get({
        json: true,
        aws,
        url: `https://lss.locaweb.com.br/${
          bucketName || defaultBucketName
        }/${objectName}`,
      });
    },
    getFile(fileName, bucketName) {
      return this.get(fileName, bucketName).then((content) => {
        return new Buffer(content, "base64");
      });
    },
    remove(objectName, bucketName) {
      return rp.delete({
        aws,
        url: `https://lss.locaweb.com.br/${
          bucketName || defaultBucketName
        }/${objectName}`,
      });
    },
    list(bucketName) {
      return rp.get({
        aws,
        url: `https://lss.locaweb.com.br/${bucketName || defaultBucketName}`,
      });
    },
    removeAllObjects(bucketName) {
      return this.list()
        .then((res) => promiseParseString(res))
        .then((xml) => {
          return Promise.all(
            xml.ListBucketResult.Contents.map((foto) => {
              return this.remove(foto.Key, bucketName);
            })
          );
        });
    },
  };
};

function promiseParseString(string) {
  return new Promise(function (resolve, reject) {
    parseString(string, function (err, result) {
      if (err) {
        return reject(err);
      } else {
        return resolve(result);
      }
    });
  });
}
