package com.retro.entity.action;

import com.retro.entity.member.Member;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedAction", types = { Action.class })
public interface DetailedAction {
  String getTitle();

  Boolean getFinished();

  Boolean getLocked();

  Member getMember();
}
