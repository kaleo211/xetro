package com.retro.entity.member;

import java.util.List;
import com.retro.entity.action.DetailedAction;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedMember", types = { Member.class })
public interface DetailedMember {
  String getUserID();

  String getFirstName();

  String getLastName();

  // @Value("#{@memberHelper.filterCheckedActions(target.actions)}")
  List<DetailedAction> getActions();
}
