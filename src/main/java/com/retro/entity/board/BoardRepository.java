package com.retro.entity.board;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(excerptProjection = DetailedBoard.class)
public interface BoardRepository extends CrudRepository<Board, Long> {
}
