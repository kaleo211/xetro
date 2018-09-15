package com.retro.entity.action;

import com.retro.entity.member.Member;
import com.retro.entity.team.Team;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedAction", types = { Action.class })
public interface DetailedAction {

  Long getId();

  String getTitle();

  Boolean getFinished();

  Boolean getLocked();

  Member getMember();

  Team getTeam();
}
