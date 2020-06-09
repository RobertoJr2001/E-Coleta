import { Request,  Response} from 'express';
import knex from '../database/connection';

export default class Pointscontroller {
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
  
    return response.json({
      id: pointId,
      ...point,
    }); 
  }
};
