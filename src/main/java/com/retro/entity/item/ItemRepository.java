package com.retro.entity.item;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(excerptProjection = DetailedItem.class)
public interface ItemRepository extends CrudRepository<Item, Long> {
}
