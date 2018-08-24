package com.retro.entity.board;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class BoardDatabaseLoader implements CommandLineRunner {
	private final BoardRepository repository;

	@Autowired
	public BoardDatabaseLoader(BoardRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
	}
}
