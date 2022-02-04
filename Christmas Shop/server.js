const express = require('express');
const open = require('open');

app = express();	
app.set('port', 8080);
app.use(express.static(__dirname));
app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
open('http://localhost:8080');