package com.retro.entity.board;

import java.sql.Timestamp;
import java.util.List;

import com.retro.entity.member.Member;
import com.retro.entity.pillar.Pillar;
import com.retro.entity.team.DetailedTeam;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "detailedBoard", types = { Board.class })
public interface DetailedBoard {
  Long getId();

  String getName();

  Boolean getLocked();

  Boolean getStarted();

  Boolean getFinished();

  Timestamp getEndTime();

  Member getFacilitator();

  List<Pillar> getPillars();

  DetailedTeam getTeam();
}
