import { Database } from "../models/index";
import { Board } from "../models/board";
import { Keyable } from "../types/common";
import { PillarServiceI } from "./pillar";

export interface BoardServiceI {
  create(name:string, groupID:string): Promise<Board>,
  findAll(whereCl:Keyable): Promise<Board[]>,
  findOne(whereCl:Keyable): Promise<Board>,
  update(id:string, fields:Keyable): Promise<void>,
}

export class BoardService implements BoardServiceI {
  pillarService: PillarServiceI;
  db: Database;

  constructor(database: Database, pillarService: PillarServiceI) {
    this.pillarService = pillarService;
    this.db = database;
  }

  public create = async (name: string, groupID: string) => {
    // if (name === '') {}

    const [newBoard, created] = await this.db.board.findOrCreate({
      where: {
        groupID,
        stage: 'created',
      },
      defaults: {
        name,
        stage: 'created',
      },
    });
    await newBoard.setGroup(groupID);

    console.info(created ? 'created new' : 'found existing', newBoard.name);
    if (created) {
      await this.pillarService.create(':D', newBoard.id);
      await this.pillarService.create(':|', newBoard.id);
      await this.pillarService.create(':(', newBoard.id);
    }

    return newBoard;
  };

  public findAll = async (whereCl: Keyable) => {
    const boards = await this.db.board.findAll({
      include: [{
        model: this.db.group,
        as: 'group',
      }],
      where: whereCl,
    });

    return boards;
  }

  public findOne = async (whereCl: Keyable) => {
    const board = await this.db.board.findOne({
      include: [
        { model: this.db.group, as: 'group' },
        {
          model: this.db.pillar,
          as: 'pillars',
          include: [
            {
              model: this.db.item,
              as: 'items',
              include: [
                {
                  model: this.db.action,
                  as: 'actions',
                  include: [
                    {
                      model: this.db.user,
                      as: 'owner',
                    }
                  ],
                }
              ],
            }
          ],
        },
      ],
      order: [
        [{ model: this.db.pillar, as: 'pillars' }, 'position', 'ASC'],
        [{ model: this.db.pillar, as: 'pillars' }, { model: this.db.item, as: 'items' }, 'likes', 'DESC'],
        [{ model: this.db.pillar, as: 'pillars' }, { model: this.db.item, as: 'items' }, 'createdAt', 'ASC'],
        [{ model: this.db.pillar, as: 'pillars' }, { model: this.db.item, as: 'items' }, { model: this.db.action, as: 'actions' }, 'createdAt', 'ASC'],
      ],
      where: whereCl,
    });

    return board;
  }

  public update = async (id: string, fields: Keyable) => {
    await this.db.board.update(
      fields,
      { where: { id } },
    );
  }
}
