package com.retro.entity.item;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.GenerationType;
import lombok.Data;

import com.retro.entity.pillar.Pillar;;

@Data
@Entity
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  @ManyToOne
  @JoinColumn(name = "pillar_id")
  private Pillar pillar;

  public Item() {
  }
}
