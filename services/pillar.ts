import { Database } from '../models/index';
import { Pillar } from '../models/pillar';
import { Keyable } from "../types/common";

export interface PillarServiceI {
  create(title:string, boardID:string): Promise<Pillar>,
  findOne(whereCl:Keyable): Promise<Pillar>,
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

  public findOne = async (whereCl: Keyable) => {
    const pillar = await this.db.pillar.findOne({
      include: [
        {
          model: this.db.board,
          as: 'board',
        },
        {
          model: this.db.item,
          as: 'items',
          order: [['createdAt', 'ASC']],
          include: [{
            model: this.db.task,
            as: 'tasks',
            include: [{ model: this.db.user, as: 'owner' }],
          }],
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
