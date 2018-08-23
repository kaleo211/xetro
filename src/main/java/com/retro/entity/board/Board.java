package com.retro.entity.board;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.OneToMany;
import javax.persistence.GenerationType;
import lombok.Data;
import java.util.List;

import com.retro.entity.pillar.Pillar;

@Data
@Entity
@Table(name = "board")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean locked;

    @OneToMany(mappedBy = "board")
    private List<Pillar> pillars;

    public Board() {
    }

    public Board(String name) {
        this.name = name;
    }
}
