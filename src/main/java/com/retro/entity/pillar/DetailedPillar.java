package com.retro.entity.pillar;

import java.util.List;
import com.retro.entity.item.DetailedItem;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedPillar", types = { Pillar.class })
public interface DetailedPillar {
  String getTitle();

  String getIntro();

  @Value("#{@pillarHelper.sortItems(target.items)}")
  List<DetailedItem> getItems();
}
