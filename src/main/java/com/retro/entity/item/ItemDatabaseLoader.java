package com.retro.entity.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ItemDatabaseLoader implements CommandLineRunner {
  private final ItemRepository repository;

  @Autowired
  public ItemDatabaseLoader(ItemRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... strings) throws Exception {
  }
}
