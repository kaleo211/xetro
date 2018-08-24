package com.retro.entity.pillar;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "pillar", path = "pillar")
public interface PillarRepository extends PagingAndSortingRepository<Pillar, Long> {
}
