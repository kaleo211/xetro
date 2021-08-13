import { Router } from "express";
import { Service } from "services";
import { ActionRouter } from "./action";
import { BoardRouter } from "./board";
import { DellRouter } from "./dell";
import { GroupRouter } from "./group";
import { ItemRouter } from "./item";
import { PillarRouter } from "./pillar";
import { SocketRouter } from "./socket";
import { UserRouter } from "./user";

export interface RouterFactory {
	router: Router;
}

export class Routers {
	public action: RouterFactory;
	public board: RouterFactory;
	public dell: RouterFactory;
	public group: RouterFactory;
	public item: RouterFactory;
	public pillar: RouterFactory;
	public socket: RouterFactory;
	public user: RouterFactory;

	constructor(service: Service) {
		this.action = new ActionRouter(service);
		this.board = new BoardRouter(service);
		this.dell = new DellRouter(service);
		this.group = new GroupRouter(service);
		this.item = new ItemRouter(service);
		this.pillar = new PillarRouter(service);
		this.socket = new SocketRouter(service);
		this.user = new UserRouter(service);
	}
}
