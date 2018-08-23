package com.retro.entity.pillar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class PillarDatabaseLoader implements CommandLineRunner {
  private final PillarRepository repository;

  @Autowired
  public PillarDatabaseLoader(PillarRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... strings) throws Exception {
  }
}
