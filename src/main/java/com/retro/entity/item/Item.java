package com.retro.entity.item;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.GenerationType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import com.retro.entity.pillar.Pillar;
import com.retro.entity.action.Action;

@Data
@Getter
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PACKAGE)
public class Item {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)

  private Long id;

  @NonNull
  private String title;

  private boolean checked;
  private int likes;

  @ManyToOne
  @JoinColumn(name = "pillar_id")
  private Pillar pillar;

  @OneToOne(mappedBy = "item", fetch = FetchType.EAGER)
  private Action action;
}
