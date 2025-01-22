// Create web server
// Create a web server that listens to incoming requests.
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/comments' && req.method === 'GET') {
    fs.readFile('comments.json', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal server error' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (req.url === '/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      fs.readFile('comments.json', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Internal server error' }));
          return;
        }

        const comments = JSON.parse(data);
        const newComment = JSON.parse(body);
        comments.push(newComment);

        fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
            return;
          }

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newComment));
        });
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});