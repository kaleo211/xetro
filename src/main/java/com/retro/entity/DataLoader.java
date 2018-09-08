package com.retro.entity;

import com.retro.entity.board.Board;
import com.retro.entity.board.BoardRepository;
import com.retro.entity.item.Item;
import com.retro.entity.item.ItemRepository;
import com.retro.entity.member.Member;
import com.retro.entity.member.MemberRepository;
import com.retro.entity.pillar.Pillar;
import com.retro.entity.pillar.PillarRepository;
import com.retro.entity.team.Team;
import com.retro.entity.team.TeamRepository;
import com.retro.entity.teammember.TeamMember;
import com.retro.entity.teammember.TeamMemberRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {
  private BoardRepository boardRepository;
  private PillarRepository pillarRepository;
  private MemberRepository memberRepository;
  private ItemRepository itemRepository;
  private TeamRepository teamRepository;

  private TeamMemberRepository teammemberRepository;

  @Autowired
  public DataLoader(BoardRepository boardRepository, PillarRepository pillarRepository,
      MemberRepository memberRepository, ItemRepository itemRepository, TeamRepository teamRepository,
      TeamMemberRepository teammemberRepository) {
    this.boardRepository = boardRepository;
    this.pillarRepository = pillarRepository;
    this.memberRepository = memberRepository;
    this.itemRepository = itemRepository;
    this.teamRepository = teamRepository;
    this.teammemberRepository = teammemberRepository;
  }

  public void run(ApplicationArguments args) {
    Team dojo = Team.builder().name("dojo").build();
    teamRepository.save(dojo);

    Team asaka = Team.builder().name("asaka").build();
    teamRepository.save(asaka);

    Member m1 = Member.builder().userID("xhe").video("http://google.com").build();
    memberRepository.save(m1);

    Board board = Board.builder().name("Week1").started(true).team(dojo).facilitator(m1).build();
    boardRepository.save(board);

    Pillar pillar1 = Pillar.builder().title("Happy").intro("I'm so happy that...").board(board).build();
    pillarRepository.save(pillar1);

    Pillar pillar2 = Pillar.builder().title("Med").intro("I'm wondering that...").board(board).build();
    pillarRepository.save(pillar2);

    Pillar pillar3 = Pillar.builder().title("Sad").intro("I'm worry about...").board(board).build();
    pillarRepository.save(pillar3);

    Item item = Item.builder().title("this is great!").pillar(pillar1).build();
    itemRepository.save(item);

    Member m2 = Member.builder().userID("yan").video("http://bing.com").build();
    memberRepository.save(m2);

    Member m3 = Member.builder().userID("xh").video("http://yahoo.com").build();
    memberRepository.save(m3);

    TeamMember tm1 = TeamMember.builder().team(dojo).member(m1).build();
    teammemberRepository.save(tm1);

    TeamMember tm2 = TeamMember.builder().team(asaka).member(m2).build();
    teammemberRepository.save(tm2);
  }
}
