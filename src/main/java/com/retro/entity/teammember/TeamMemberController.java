package com.retro.entity.teammember;

import java.util.ArrayList;
import java.util.List;

import com.retro.entity.member.DetailedMember;
import com.retro.entity.team.DetailedTeam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.projection.ProjectionFactory;
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
  private final ProjectionFactory projectionFactory;

  @Autowired
  public TeamMemberController(TeamMemberRepository repository, ProjectionFactory projectionFactory) {
    this.repository = repository;
    this.projectionFactory = projectionFactory;
  }

  @GetMapping(value = "/team/{id}", produces = "application/hal+json")
  public @ResponseBody ResponseEntity<?> getMembers(@PathVariable("id") final Long id) {
    List<DetailedMember> members = new ArrayList<DetailedMember>();
    repository.findMembersByTeamID(id).forEach(member -> {
      members.add(projectionFactory.createProjection(DetailedMember.class, member));
    });
    Resources<DetailedMember> resources = new Resources<DetailedMember>(members);
    return ResponseEntity.ok(resources);
  }

  @GetMapping(value = "/member/{id}", produces = "application/hal+json")
  public @ResponseBody ResponseEntity<?> getTeams(@PathVariable("id") final Long id) {
    List<DetailedTeam> teams = new ArrayList<DetailedTeam>();
    repository.findTeamsByMemberID(id).forEach(team -> {
      teams.add(projectionFactory.createProjection(DetailedTeam.class, team));
    });
    Resources<DetailedTeam> resources = new Resources<DetailedTeam>(teams);
    return ResponseEntity.ok(resources);
  }
}
