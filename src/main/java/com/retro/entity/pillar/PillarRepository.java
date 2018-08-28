package com.retro.entity.pillar;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(excerptProjection = DetailedPillar.class)
public interface PillarRepository extends CrudRepository<Pillar, Long> {
}
