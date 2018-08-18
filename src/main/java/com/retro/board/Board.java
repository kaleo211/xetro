package com.retro.board;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity
public class Board {
    private @Id @GeneratedValue Long id;

    private String name;

    public Board(String name) {
        this.name = name;
    }
}
