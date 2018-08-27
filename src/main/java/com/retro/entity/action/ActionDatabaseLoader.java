package com.retro.entity.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ActionDatabaseLoader implements CommandLineRunner {
  private final ActionRepository repository;

  @Autowired
  public ActionDatabaseLoader(ActionRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... strings) throws Exception {
  }
}
