package com.retro.board;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "com.retro.board", entityManagerFactoryRef = "emf")
public interface BoardRepository extends CrudRepository<Board, Long> {
}
