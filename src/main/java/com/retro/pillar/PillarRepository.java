package com.retro.pillar;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "pillar", path = "pillar")
public interface PillarRepository extends PagingAndSortingRepository<Pillar, Long> {
}
