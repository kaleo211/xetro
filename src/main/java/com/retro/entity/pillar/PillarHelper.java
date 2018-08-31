package com.retro.entity.pillar;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.retro.entity.item.Item;
import org.springframework.stereotype.Component;

@Component
public class PillarHelper {
  public List<Item> sortItems(final List<Item> items) {
    List<Item> sorted = new ArrayList<>(items);
    Collections.sort(sorted, (Item i1, Item i2) -> {
      if (i1.getId() > i2.getId()) {
        return 1;
      }
      return -1;
    });
    return sorted;
  }
}
