import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, INTEGER, HasManyGetAssociationsMixin } from 'sequelize';
import { Board } from './board';
import { BelongsToSetAssociationMixin } from 'sequelize';

export class Pillar extends Model {
  id: string;
  title: string;
  position: number;

  public setBoard!: BelongsToSetAssociationMixin<Board, string>;
}

export type PillarStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Pillar;
}

export function PillarFactory(sequelize: Sequelize): PillarStatic {
  return <PillarStatic>sequelize.define("Pillar", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: () => uuid(),
    },
    title: STRING,
    position: {
      type: INTEGER,
      autoIncrement: true,
    }
  });
}
