package com.retro.entity.member;

import java.util.ArrayList;
import java.util.List;
import com.retro.entity.action.Action;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MemberHelper {
  Logger logger = LoggerFactory.getLogger(this.getClass());

  public List<Action> filterCheckedActions(final List<Action> actions) {
    logger.info(actions.toString());

    List<Action> filterd = new ArrayList<>(actions);
    return null;// filterd.stream().filter(action ->
                // action.isFinished()).collect(Collectors.toList());
  }
}
