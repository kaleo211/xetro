package com.retro.entity.board;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(excerptProjection = DetailedBoard.class)
public interface BoardRepository extends JpaRepository<Board, Long> {

  List<DetailedBoard> findByStartedAndFinished(Boolean started, Boolean finished);

  @Query(value = "SELECT b FROM Board b WHERE b.team.id = ?1 and b.started=true and b.finished=false")
  List<DetailedBoard> findActiveBoardsByTeam(Long teamId);
}
