let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/get-profile',function(req,res){
    let response = {};

    MongoClient.connect('mongodb://admin:password@localhost:27017',function(err,client){
        if(err) throw err;

        let db = client.db('user-account');
        let query = {userid:1};
        db.collection('users').findOne(query,function(err,result){
            if(err) throw err;
            response = result;
            client.close();
            res.send(response ? response : {});
        });
    });
});

app.post('/update-profile',function(req, res){
    var userObj = req.body;
    var response = res;

    console.log('connecting to mongodb');

    MongoClient.connect('mongodb://admin:password@localhost:27017',function(err,client){
        if(err) throw err;
        var db = client.db('user-account');
        userObj['userid'] = 1;
        var query = {userid:1};
        var newValues = {$set:userObj};

        console.log('successfully connected to mongodb');

        db.collection('users').updateOne(query,newValues,{upsert:true},function(err,result){
            if (err) throw err;
            console.log('successfully updated user profile');
            client.close();
            response.send(userObj);
        });
    });
});

app.get('/profile-picture',function(req,res){
    var img = fs.readFileSync('images/profile-1.jpg');
    res.writeHead(200,{'Content-Type':'image/jpg'});
    res.end(img,'binary');
});

app.listen(3000,function(){
    console.log('Server is running on port 3000');
});
