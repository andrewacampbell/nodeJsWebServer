const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

var mimeTypes = {
  "html"  : "text/html",
  "jpeg"  : "image/jpeg",
  "jpg"   : "image/png",
  "js"    : "text/javascript",
  "css"   : "text/css"
};

//Create server
http.createServer((req, res) => {
  //parse request containing file name
  var uri = url.parse(req.url).pathname;
  //get file name
  var fileName = path.join(process.cwd(), unescape(uri));
  console.log('loading ' + uri);
  var stats;

  //check to see if requested file is found
  try {
    stats = fs.lstatSync(fileName);
  } catch(ex) {
    res.writeHead(404, {'Content-type': 'text/plain'});
    res.write('404 your file is on a vacation \n');
    res.end();
    return;

  }
  //check to see a file || a directory was return
  if(stats.isFile()) {
    var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
    res.writeHead(200, {'Content-type': mimeType});

    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);

  } else if(stats.isDirectory()) {
    res.writeHead(302, {
      'Location' : 'index.html'
    });
    res.end();
  } else{
    res.writeHead(500, {'Content-Type' : 'text/plain'});
    res.write('500 Internal Error \n');
    res.end();
  }

}).listen(3000);
