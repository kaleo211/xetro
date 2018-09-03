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

  @Autowired
  public DataLoader(BoardRepository boardRepository, PillarRepository pillarRepository,
      MemberRepository memberRepository, ItemRepository itemRepository, TeamRepository teamRepository) {
    this.boardRepository = boardRepository;
    this.pillarRepository = pillarRepository;
    this.memberRepository = memberRepository;
    this.itemRepository = itemRepository;
    this.teamRepository = teamRepository;
  }

  public void run(ApplicationArguments args) {
    Board board = Board.builder().name("Week").build();
    boardRepository.save(board);

    Pillar pillar = Pillar.builder().title("Happy").intro("I'm so happy that...").board(board).build();
    pillarRepository.save(pillar);

    pillar = Pillar.builder().title("Med").intro("I'm wondering that...").board(board).build();
    pillarRepository.save(pillar);

    pillar = Pillar.builder().title("Sad").intro("I'm worry about...").board(board).build();
    pillarRepository.save(pillar);

    Item item = Item.builder().title("this is great!").pillar(pillar).build();
    itemRepository.save(item);

    memberRepository.save(Member.builder().userID("xhe").video("http://google.com").build());
    memberRepository.save(Member.builder().userID("yan").video("http://bing.com").build());
    memberRepository.save(Member.builder().userID("xh").video("http://yahoo.com").build());

    teamRepository.save(Team.builder().name("dojo").build());
    teamRepository.save(Team.builder().name("asaka").build());
  }
}
