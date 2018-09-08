package com.retro.entity.member;

import java.util.List;
import com.retro.entity.action.DetailedAction;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedMember", types = { Member.class })
public interface DetailedMember {
  Long getId();

  String getUserID();

  String getFirstName();

  String getLastName();

  String getVideo();

  String getEmail();

  // @Value("#{@memberHelper.filterCheckedActions(target.actions)}")
  List<DetailedAction> getActions();
}
