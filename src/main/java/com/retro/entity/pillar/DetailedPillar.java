
package com.retro.entity.pillar;

import java.util.List;

import com.retro.entity.item.DetailedItem;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedPillar", types = { Pillar.class })
public interface DetailedPillar {
  String getTitle();

  List<DetailedItem> getItems();
}
