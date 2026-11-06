// const func = (a, b) => {

//     let nums = a * b;

//     console.log(nums); 

// }

// func(25, 10);
function func(a, b) 
{

    let nums = a * b;

    console.log(nums); 
}

func(25, 10);
const http = require('http');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello from Node.js on Render!</h1><p>Basic JavaScript Server Running.</p>');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
