package com.retro.entity.board;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
public class BoardRestConfig extends RepositoryRestConfigurerAdapter {
  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration repositoryRestConfiguration) {
    repositoryRestConfiguration.getProjectionConfiguration().addProjection(DetailedBoard.class);
    repositoryRestConfiguration.exposeIdsFor(Board.class);
  }
}
