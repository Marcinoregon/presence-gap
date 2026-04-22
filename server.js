const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
    '.css':  'text/css',
      '.js':   'application/javascript',
        '.png':  'image/png',
          '.jpg':  'image/jpeg',
            '.svg':  'image/svg+xml',
              '.ico':  'image/x-icon',
                '.woff2':'font/woff2',
                };

                http.createServer((req, res) => {
                  let urlPath = req.url.split('?')[0];
                    if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

                      const filePath = path.join(__dirname, urlPath);
                        const ext      = path.extname(filePath);
                          const mime     = MIME[ext] || 'text/plain';

                            fs.readFile(filePath, (err, data) => {
                                if (err) {
                                      fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
                                              if (err2) { res.writeHead(404); res.end('Not found'); return; }
                                                      res.writeHead(200, { 'Content-Type': 'text/html' });
                                                              res.end(data2);
                                                                    });
                                                                          return;
                                                                              }
                                                                                  res.writeHead(200, { 'Content-Type': mime });
                                                                                      res.end(data);
                                                                                        });
                                                                                        }).listen(PORT, () => {
                                                                                          console.log(`Presence Gap running on port ${PORT}`);
                                                                                          });
