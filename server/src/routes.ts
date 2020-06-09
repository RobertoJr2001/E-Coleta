import express from 'express';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*');

  const serailizedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://localhost:3333/uploads/${item.image}`,
    };
  });

  return response.json(serailizedItems);
});

routes.post('/points', async (request, response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items
  } = request.body;

  const trx = await knex.transaction();

  const insertedId = await trx('points').insert({
    image: 'fake-img',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf
  });

  const pointId = insertedId[0];

  const pointItems = items.map( (item_id: number) => {
    return {
      item_id,
    };
  });
  
  await knex('point_items').insert(pointItems);

  return response.json({success: true});
});

export default routes;