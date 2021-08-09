import { Item } from '../models/item';
import { Board } from '../models/board';
import { Database } from '../models/index';
import { Action } from '../models/action';
import { User } from '../models/user';
import { Pillar } from 'models/pillar';
import { keyable } from 'utils/tool';

export interface PillarServiceI {
  create(title:string, boardID:string): Promise<Pillar>,
  findOne(whereCl:keyable): Promise<Pillar>,
  remove(id:string): Promise<void>,
  updateTitle(id:string, title:string): Promise<void>,
}

export class PillarService implements PillarServiceI {
  db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public create = async (title: string, boardID: string) => {
    const newPillar = await this.db.pillar.create({ title });
    await newPillar.setBoard(boardID);
    return newPillar;
  };

  public findOne = async (whereCl: keyable) => {
    const pillar = await this.db.pillar.findOne({
      include: [
        {
          model: Board,
          as: 'board',
        },
        {
          model: Item,
          as: 'items',
          order: [['createdAt', 'ASC']],
          include: [
            {
              model: Action,
              as: 'actions',
              include: [
                {
                  model: User,
                  as: 'owner',
                }
              ],
            }
          ],
        }
      ],
      where: whereCl,
    });
    return pillar;
  }

  public remove = async (id: string) => {
    await this.db.pillar.destroy({
      where: { id },
    });
  }

  public updateTitle = async (id: string, title: string) => {
    await this.db.pillar.update(
      { title },
      { where: { id } },
    );
  }
}
