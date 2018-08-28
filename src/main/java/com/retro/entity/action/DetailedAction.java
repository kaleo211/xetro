package com.retro.entity.action;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedAction", types = { Action.class })
public interface DetailedAction {
  String getTitle();
}
