import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const vehicles = [
  { id: 1, vehicleName: 'Hyundai Creta', vehicleNumber: 'HR26AB1234', type: 'SUV', price: 1500000 },
  { id: 2, vehicleName: 'Honda City', vehicleNumber: 'DL3CAB4321', type: 'Sedan', price: 1200000 },
  { id: 3, vehicleName: 'Tata Nexon', vehicleNumber: 'UP16CD5678', type: 'SUV', price: 1100000 }
];

const REQUIRED_FIELDS = ['id', 'vehicleName', 'vehicleNumber', 'type', 'price'];

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

const sendHtml = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html' });
  res.end(html);
};

const sendText = (res, statusCode, text) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  res.end(text);
};

const handleAddVehicle = (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let newVehicle;
    try {
      newVehicle = JSON.parse(body);
    } catch (error) {
      return sendJson(res, 400, { error: 'Invalid JSON' });
    }

    const missing = REQUIRED_FIELDS.filter(
      (field) =>
        newVehicle[field] === undefined ||
        newVehicle[field] === null ||
        newVehicle[field] === ''
    );

    if (missing.length > 0) {
      return sendJson(res, 400, {
        error: 'Missing required fields',
        missingFields: missing
      });
    }

    const vehicle = {
      id: newVehicle.id,
      vehicleName: newVehicle.vehicleName,
      vehicleNumber: newVehicle.vehicleNumber,
      type: newVehicle.type,
      price: newVehicle.price
    };

    vehicles.push(vehicle);
    sendJson(res, 201, { message: 'Vehicle added successfully', vehicle });
  });
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  if (pathname === '/' && method === 'GET') {
    return sendHtml(
      res,
      200,
      '<h1>Welcome to Vehicle Management System</h1>' +
        '<ul>' +
        '<li><a href="/vehicles">Vehicles</a></li>' +
        '<li><a href="/about">About</a></li>' +
        '<li><a href="/info">Info</a></li>' +
        '</ul>'
    );
  }

  if (pathname === '/vehicles' && method === 'GET') {
    return sendJson(res, 200, vehicles);
  }

  if (pathname === '/about' && method === 'GET') {
    return sendText(
      res,
      200,
      'Vehicle Management Web Application - built with the Node.js HTTP module (no Express).'
    );
  }

  if (pathname === '/info' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'info.html');
    return fs.readFile(filePath, (err, data) => {
      if (err) {
        return sendText(res, 500, 'Internal Server Error: could not read info.html');
      }
      sendHtml(res, 200, data);
    });
  }

  if (pathname === '/add-vehicle' && method === 'POST') {
    return handleAddVehicle(req, res);
  }

  sendJson(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
