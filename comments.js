// Create web server
// 1. Create a web server
// 2. Handle requests and responses
// 3. Read and write files
// 4. Read and write JSON data
// 5. Create a simple API

const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    const query = url.parse(req.url, true).query;

    if (req.method === 'GET') {
        if (path === '/comments') {
            fs.readFile('./comments.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Internal Server Error' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        }
    }

    if (req.method === 'POST') {
        if (path === '/comments') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const { name, comment } = qs.parse(body);

                fs.readFile('./comments.json', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    }

                    const comments = JSON.parse(data);
                    comments.push({ name, comment });

                    fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Internal Server Error' }));
                        }

                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Comment created successfully' }));
                    });
                });
            });
        }
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});