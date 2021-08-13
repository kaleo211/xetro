import { Sequelize } from 'sequelize';
import { ActionFactory, ActionStatic } from './action';
import { BoardFactor, BoardStatic } from './board';
import { GroupFactory, GroupStatic } from './group';
import { ItemFactory, ItemStatic } from './item';
import { PillarFactory, PillarStatic } from './pillar';
import { UserFactory, UserStatic } from './user';


export class Database {
  public action: ActionStatic;
  public board: BoardStatic;
  public user: UserStatic;
  public pillar: PillarStatic;
  public group: GroupStatic;
  public item: ItemStatic;

  constructor(sequelize: Sequelize) {
    this.action = ActionFactory(sequelize);
    this.board = BoardFactor(sequelize);
    this.group = GroupFactory(sequelize);
    this.item = ItemFactory(sequelize);
    this.pillar = PillarFactory(sequelize);
    this.user = UserFactory(sequelize);

    this.user.belongsToMany(this.group, { as: 'groups', through: 'GroupMember', foreignKey: 'userID' });
    this.user.hasMany(this.action, { as: 'actions', foreignKey: 'ownerID' });

    this.pillar.belongsTo(this.board, { as: 'board', foreignKey: 'boardID' });
    this.pillar.hasMany(this.item, { as: 'items', foreignKey: 'pillarID' });

    this.item.belongsTo(this.group, { as: 'group', foreignKey: 'groupID' });
    this.item.belongsTo(this.pillar, { as: 'pillar', foreignKey: 'pillarID' });
    this.item.belongsTo(this.user, { as: 'owner', foreignKey: 'ownerID' });
    this.item.hasMany(this.action, { as: 'actions', foreignKey: 'itemID' });

    this.group.belongsToMany(this.user, { as: 'members', through: 'GroupMember', foreignKey: 'groupID' });
    this.group.hasMany(this.board, { as: 'boards', foreignKey: 'groupID', sourceKey: 'id' });
    this.group.hasMany(this.action, { as: 'actions', foreignKey: 'groupID' });
    this.group.belongsTo(this.user, { as: 'facilitator', foreignKey: 'facilitatorID'});

    this.board.belongsTo(this.group, { as: 'group', foreignKey: 'groupID', targetKey: 'id' });
    this.board.hasMany(this.pillar, { as: 'pillars', foreignKey: 'boardID' });
    this.board.hasMany(this.action, { as: 'actions', foreignKey: 'boardID' });

    this.action.belongsTo(this.group, { as: 'group', foreignKey: 'groupID' });
    this.action.belongsTo(this.board, { as: 'board', foreignKey: 'boardID' });
    this.action.belongsTo(this.user, { as: 'owner', foreignKey: 'ownerID' });
    this.action.belongsTo(this.item, { as: 'item', foreignKey: 'itemID' });

    sequelize.sync({ force: true }).then(() => {
      console.warn('database tables created');
    });
  }
}

