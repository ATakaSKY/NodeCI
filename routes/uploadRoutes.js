const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/dev');

const s3 = new AWS.S3({
    accessKeyId:keys.accessKeyId,
    secretAccessKey:keys.secretAccessKey,
    signatureVersion:'v4',
    region:'ap-south-1'
})

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => { 
        const key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket:'bucket-4',
            ContentType:'image/*',
            Key:key
        }, (err,url) => res.send({key, url}));

    })
}