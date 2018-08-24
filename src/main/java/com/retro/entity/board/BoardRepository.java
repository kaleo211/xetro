package com.retro.entity.board;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "board", path = "board")
public interface BoardRepository extends PagingAndSortingRepository<Board, Long> {
}