package com.retro.entity.action;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "action", path = "action")
public interface ActionRepository extends PagingAndSortingRepository<Action, Long> {
}
