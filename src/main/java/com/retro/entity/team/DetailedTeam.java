package com.retro.entity.team;

import java.sql.Timestamp;
import java.util.List;

import com.retro.entity.board.Board;
import com.retro.entity.member.DetailedMember;
import com.retro.entity.member.Member;
import com.retro.entity.pillar.DetailedPillar;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedTeam", types = { Team.class })
public interface DetailedTeam {
  String getName();

  List<DetailedMember> getMembers();

  List<Board> getBoards();
}
