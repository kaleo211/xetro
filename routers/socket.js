import express from 'express';
const routers = express.Router();

routers.get('/', (req, res) => {
  res.send({ response: 'I am alive' }).status(200);
});

export default routers;
