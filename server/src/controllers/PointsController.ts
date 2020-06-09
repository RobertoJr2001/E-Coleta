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
  
    return response.json({
      id: pointId,
      ...point,
    }); 
  }
};
