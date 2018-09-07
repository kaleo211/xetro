package com.retro.entity.teammember;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class TeamMemberDatabaseLoader implements CommandLineRunner {
  private final TeamMemberRepository repository;

  @Autowired
  public TeamMemberDatabaseLoader(TeamMemberRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... args) throws Exception {
  }
}
