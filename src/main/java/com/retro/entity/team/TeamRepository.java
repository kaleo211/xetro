package com.retro.entity.team;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(excerptProjection = DetailedTeam.class)
public interface TeamRepository extends CrudRepository<Team, Long> {
}
