package com.retro.entity.board;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(excerptProjection = DetailedBoard.class)
public interface BoardRepository extends JpaRepository<Board, Long> {

  List<Board> findByStartedAndFinished(Boolean started, Boolean finished);
}
