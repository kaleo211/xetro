package com.retro.entity.board;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.GenerationType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.retro.entity.member.Member;
import com.retro.entity.pillar.Pillar;
import com.retro.entity.team.Team;

@Data
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PACKAGE)
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean locked;
    private boolean finished;
    private boolean started;
    private Timestamp endTime;

    @ManyToOne
    @JoinColumn(name = "facilitator_id")
    private Member facilitator;

    @ManyToOne
    @JoinColumn(name = "selected_id")
    private Member selected;

    @OneToMany(mappedBy = "board", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Pillar> pillars;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
}
