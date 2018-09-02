package com.retro.entity.team;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TeamDatabaseLoader implements CommandLineRunner {
	private final TeamRepository repository;

	@Autowired
	public TeamDatabaseLoader(TeamRepository repository) {
		this.repository = repository;
	}

	@Override
	public void run(String... strings) throws Exception {
	}
}
