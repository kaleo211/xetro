package com.retro.entity.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MemberDatabaseLoader implements CommandLineRunner {
  private final MemberRepository repository;

  @Autowired
  public MemberDatabaseLoader(MemberRepository repository) {
    this.repository = repository;
  }

  @Override
  public void run(String... args) throws Exception {
  }
}
