package com.retro.pillar;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.GenerationType;
import lombok.Data;

import com.retro.board.Board;

@Data
@Entity
public class Pillar {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @ManyToOne
  @JoinColumn(name = "board_id")
  private Board board;

  public Pillar() {
  }
}
