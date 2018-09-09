package com.retro.entity.board;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@RepositoryRestController
@RequestMapping(value = "/boards")
public class BoardController {

  private final BoardRepository repository;

  @Autowired
  public BoardController(BoardRepository repository) {
    this.repository = repository;
  }

  @RequestMapping(method = RequestMethod.GET, value = "/active", produces = "application/hal+json")
  public @ResponseBody ResponseEntity<?> getActiveBoards() {
    List<DetailedBoard> boards = repository.findByStartedAndFinished(true, false);
    Resources<DetailedBoard> resources = new Resources<DetailedBoard>(boards);
    return ResponseEntity.ok(resources);
  }

  @RequestMapping(method = RequestMethod.GET, value = "/active/team/{id}", produces = "application/hal+json")
  public @ResponseBody ResponseEntity<?> getActiveBoardsByTeam(@PathVariable("id") final Long id) {
    List<DetailedBoard> boards = repository.findActiveBoardsByTeam(id);
    Resources<DetailedBoard> resources = new Resources<DetailedBoard>(boards);
    return ResponseEntity.ok(resources);
  }
}
