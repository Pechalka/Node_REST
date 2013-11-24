var express = require('express')
    , http = require('http')
    , path = require('path')

var DAO = require('./dao/DAO');

var app = express();

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



var category = DAO('category');

app.get('/api/category', function(req, res){
    delete req.query['_'];
    category.readAll(req.query, function(e, data){
        res.json(data)
    })
})

app.get('/api/category/:id', function(req, res){
    category.read(req.params["id"], function(e, data){
        res.json(data);
    })
})


app.post('/api/category', function(req, res){
    category.create(req.body, function(e, obj){
        res.json(obj);
    })
})

app.delete('/api/category/:id', function(req, res){
    category.remove(req.params["id"], function(e, result){
        res.json({ success : true });
    })
})

app.put('/api/category/:id', function(req, res){
    category.update(req.body, req.params["id"], function(e, obj){
        res.json(obj);
    })
})







http.createServer(app).listen(3000, function(){
    console.log('Express server listening on port 3000');
});
