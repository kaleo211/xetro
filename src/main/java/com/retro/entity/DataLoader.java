package com.retro.entity;

import com.retro.entity.board.Board;
import com.retro.entity.board.BoardRepository;
import com.retro.entity.item.Item;
import com.retro.entity.item.ItemRepository;
import com.retro.entity.member.Member;
import com.retro.entity.member.MemberRepository;
import com.retro.entity.pillar.Pillar;
import com.retro.entity.pillar.PillarRepository;

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

  @Autowired
  public DataLoader(BoardRepository boardRepository, PillarRepository pillarRepository,
      MemberRepository memberRepository, ItemRepository itemRepository) {
    this.boardRepository = boardRepository;
    this.pillarRepository = pillarRepository;
    this.memberRepository = memberRepository;
    this.itemRepository = itemRepository;
  }

  public void run(ApplicationArguments args) {
    Board board = Board.builder().name("Week").build();
    boardRepository.save(board);

    Pillar pillar = Pillar.builder().title("Happy").board(board).build();
    pillarRepository.save(pillar);

    pillar = Pillar.builder().title("Med").board(board).build();
    pillarRepository.save(pillar);

    pillar = Pillar.builder().title("Sad").board(board).build();
    pillarRepository.save(pillar);

    Item item = Item.builder().title("this is great!").pillar(pillar).build();
    itemRepository.save(item);

    memberRepository.save(Member.builder().userID("xhe").build());
    memberRepository.save(Member.builder().userID("yan").build());
    memberRepository.save(Member.builder().userID("xh").build());
  }
}
