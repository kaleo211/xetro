package com.retro.entity.member;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter;

@Configuration
public class MemberRestConfig extends RepositoryRestConfigurerAdapter {
  @Override
  public void configureRepositoryRestConfiguration(RepositoryRestConfiguration repositoryRestConfiguration) {
    repositoryRestConfiguration.getProjectionConfiguration().addProjection(DetailedMember.class);
    repositoryRestConfiguration.exposeIdsFor(Member.class);
  }
}
