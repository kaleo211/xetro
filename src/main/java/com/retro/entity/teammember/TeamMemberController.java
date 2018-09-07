package com.retro.entity.teammember;

import java.util.List;

import com.retro.entity.member.Member;
import com.retro.entity.team.Team;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resources;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@RepositoryRestController
@RequestMapping(value = "/teamMember")
public class TeamMemberController {
  private final TeamMemberRepository repository;

  @Autowired
  public TeamMemberController(TeamMemberRepository repository) {
    this.repository = repository;
  }

  @GetMapping(value = "/teams/{id}", produces = "application/hal+json")
  public @ResponseBody ResponseEntity<?> getMembers(@PathVariable("id") final Long id) {
    List<Member> members = repository.findMembersByTeamID(id);
    Resources<Member> resources = new Resources<Member>(members);
    return ResponseEntity.ok(resources);
  }

  @GetMapping(value = "/members/{id}", produces = "application/hal+json")
  public @ResponseBody ResponseEntity<?> getTeams(@PathVariable("id") final Long id) {
    List<Team> teams = repository.findTeamsByMemberID(id);
    Resources<Team> resources = new Resources<Team>(teams);
    return ResponseEntity.ok(resources);
  }
}
