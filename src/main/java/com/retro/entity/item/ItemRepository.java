package com.retro.entity.item;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "item", path = "item")
public interface ItemRepository extends PagingAndSortingRepository<Item, Long> {
}
