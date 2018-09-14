package com.retro.entity.action;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
public class ActionRestConfig extends RepositoryRestConfigurerAdapter {
  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration repositoryRestConfiguration) {
    repositoryRestConfiguration.getProjectionConfiguration().addProjection(DetailedAction.class);
    repositoryRestConfiguration.exposeIdsFor(Action.class);
  }
}
