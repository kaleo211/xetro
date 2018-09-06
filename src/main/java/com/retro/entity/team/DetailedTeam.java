package com.retro.entity.team;

import java.util.List;
import com.retro.entity.board.Board;
import com.retro.entity.member.DetailedMember;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedTeam", types = { Team.class })
public interface DetailedTeam {
  Long getId();

  String getName();

  List<DetailedMember> getMembers();

  List<Board> getBoards();
}
