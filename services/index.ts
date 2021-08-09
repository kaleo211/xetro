import { Database } from "models";
import { ActionService, ActionServiceI } from "./action";
import { BoardService, BoardServiceI } from "./board";
import { GroupService, GroupServiceI } from "./group";
import { ItemService, ItemServiceI } from "./item";
import { PillarService, PillarServiceI } from "./pillar";
import { UserService, UserServiceI } from "./user";

export interface ServiceI {
	action: ActionServiceI;
	board: BoardServiceI;
	group: GroupServiceI;
	item: ItemServiceI;
	pillar: PillarServiceI;
	user: UserServiceI;
}

export class Service implements ServiceI {
	action: ActionServiceI;
	board: BoardServiceI;
	group: GroupServiceI;
	item: ItemServiceI;
	pillar: PillarServiceI;
	user: UserServiceI;

	constructor(database: Database) {
		this.action = new ActionService(database);
		this.group = new GroupService(database);
		this.item = new ItemService(database);
		this.pillar = new PillarService(database);
		this.user = new UserService(database);

		this.board = new BoardService(database, this.pillar);
	}
}
