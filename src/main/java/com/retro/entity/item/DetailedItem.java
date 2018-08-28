package com.retro.entity.item;

import com.retro.entity.action.Action;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedItem", types = { Item.class })
public interface DetailedItem {
  @Value("#{target.id}")
  long getId();

  String getTitle();

  Boolean getChecked();

  Integer getLikes();

  Action getAction();
}
