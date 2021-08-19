import { v4 as uuid} from 'uuid';
import { Model, Sequelize, STRING, BuildOptions, UUID, INTEGER, DATE, BelongsToSetAssociationMixin } from 'sequelize';
import { User } from './user';
import { Pillar } from './pillar';
import { Group } from './group';

export class Item extends Model {
  id: string;
  title: string;
  likes: number;
  stage: string;
  end: Date;

  public setOwner!: BelongsToSetAssociationMixin<User, string>;
  public setPillar!: BelongsToSetAssociationMixin<Pillar, string>;
  public setGroup!: BelongsToSetAssociationMixin<Group, string>;
}

export type ItemStatic = typeof Model & (new (values?: object, options?: BuildOptions) => Item);

export function ItemFactory(sequelize: Sequelize): ItemStatic {
  return sequelize.define("Item", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: UUID,
      defaultValue: () => uuid(),
    },
    title: STRING,
    likes: {
      type: INTEGER,
      defaultValue: 1,
    },
    stage: {
      type: STRING,
      defaultValue: 'created',
    },
    end: DATE,
  }) as ItemStatic;
}
