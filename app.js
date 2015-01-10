var express = require('express');
var path = require('path');

var app = express();

app.set('view engine', 'vash');
app.set('views', path.join(__dirname, '/views'));
app.set('port', process.env.PORT || 3000);

app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.render('index');
});
app.get('/edit', function (req, res) {
    res.render('edit');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), function () {
    //debug('Express server listening on port ' + server.address().port);
});
