package com.retro.entity.board;

import java.sql.Timestamp;
import java.util.List;

import com.retro.entity.member.Member;
import com.retro.entity.pillar.DetailedPillar;
import com.retro.entity.team.Team;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedBoard", types = { Board.class })
public interface DetailedBoard {
  String getName();

  Boolean getLocked();

  Boolean getStarted();

  Boolean getFinished();

  Timestamp getEndTime();

  Member getFacilitator();

  Member getSelected();

  List<DetailedPillar> getPillars();

  Team getTeam();
}
