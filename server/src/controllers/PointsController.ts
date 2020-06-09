import { Request,  Response} from 'express';
import knex from '../database/connection';

export default class Pointscontroller { 
  async create (request: Request, response: Response) {
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

    const point = {
      image: 'fake-img',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    };
  
    const insertedId = await trx('points').insert(point);
  
    const pointId = insertedId[0];
  
    const pointItems = items.map( (item_id: number) => {
      return {
        item_id,
      };
    });
    
    await knex('point_items').insert(pointItems);

    await trx.commit();
  
    return response.json({
      id: pointId,
      ...point,
    }); 
  }

  async index (request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

      const points = await knex('points')
        .join('point_items', 'point_id', '*', 'point_items.point_id')
        .whereIn('point_items.point_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

      response.json(points);
  }

  async show (request: Request, response: Response) {
    const { id } = request.params;
    const points = await knex('points').where('id', id).first();
    
    if (!points) {
      return response.status(400).json({ message: 'Point not found' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '*', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');
    return response.json({ points, items});
  }

};
