package com.retro.board;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "board", path = "board")
public interface BoardRepository extends PagingAndSortingRepository<Board, Long> {
}
