import { Model, Sequelize, STRING, BuildOptions, UUID, BOOLEAN, INTEGER, BelongsToSetAssociationMixin } from 'sequelize';
import { v4 as uuid } from 'uuid';
import { Group } from './group';

export class Board extends Model {
  id: string;
  name: string;
  stage: string;
  chat: string;
  locked: boolean;
  timer: number;

  public setGroup!: BelongsToSetAssociationMixin<Group, string>;
}

export type BoardStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Board);

export function BoardFactor(sequelize: Sequelize): BoardStatic {
  return sequelize.define("Board", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: () => uuid(),
    },
    name: STRING,
    stage: STRING,
    chat: STRING,
    locked: {
      type: BOOLEAN,
      defaultValue: false,
    },
    timer: INTEGER,
  }) as BoardStatic;
}
