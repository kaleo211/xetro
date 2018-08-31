package com.retro.entity.item;

import java.sql.Timestamp;

import com.retro.entity.action.DetailedAction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedItem", types = { Item.class })
public interface DetailedItem {
  @Value("#{target.id}")
  long getId();

  String getTitle();

  Boolean getChecked();

  Integer getLikes();

  DetailedAction getAction();

  Boolean getStarted();

  Timestamp getStartTime();
}
