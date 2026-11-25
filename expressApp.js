import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let vehicles = [
  { id: 1, vehicleName: 'Hyundai Creta', vehicleNumber: 'HR26AB1234', type: 'SUV', price: 1500000 },
  { id: 2, vehicleName: 'Honda City', vehicleNumber: 'DL3CAB4321', type: 'Sedan', price: 1200000 },
  { id: 3, vehicleName: 'Tata Nexon', vehicleNumber: 'UP16CD5678', type: 'SUV', price: 1100000 }
];

const isBlank = (value) => value === undefined || value === null || value === '';

// Returns an error message string, or null if the data is valid
const validateVehicle = (data, requireId) => {
  const fields = requireId
    ? ['id', 'vehicleName', 'vehicleNumber', 'type', 'price']
    : ['vehicleName', 'vehicleNumber', 'type', 'price'];

  const missing = fields.filter((field) => isBlank(data[field]));
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  if (typeof data.price !== 'number' || !(data.price > 0)) {
    return 'Price must be a positive number';
  }
  return null;
};

// GET all vehicles
app.get('/vehicles', (req, res) => {
  res.json(vehicles);
});

// GET vehicle by ID
app.get('/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find((v) => v.id === Number(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(vehicle);
});

// POST add a new vehicle
app.post('/vehicles', (req, res) => {
  const data = req.body || {};
  const error = validateVehicle(data, true);
  if (error) {
    return res.status(400).json({ error });
  }
  if (vehicles.some((v) => v.id === data.id)) {
    return res.status(400).json({ error: 'Vehicle with this id already exists' });
  }

  const vehicle = {
    id: data.id,
    vehicleName: data.vehicleName,
    vehicleNumber: data.vehicleNumber,
    type: data.type,
    price: data.price
  };
  vehicles.push(vehicle);
  res.status(201).json({ message: 'Vehicle added successfully', vehicle });
});

// PUT update a vehicle
app.put('/vehicles/:id', (req, res) => {
  const vehicle = vehicles.find((v) => v.id === Number(req.params.id));
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const data = req.body || {};
  const error = validateVehicle(data, false);
  if (error) {
    return res.status(400).json({ error });
  }

  vehicle.vehicleName = data.vehicleName;
  vehicle.vehicleNumber = data.vehicleNumber;
  vehicle.type = data.type;
  vehicle.price = data.price;
  res.json({ message: 'Vehicle updated successfully', vehicle });
});

// DELETE a vehicle
app.delete('/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex((v) => v.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  const [deleted] = vehicles.splice(index, 1);
  res.json({ message: 'Vehicle deleted successfully', vehicle: deleted });
});

// Invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Invalid JSON body and other errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
