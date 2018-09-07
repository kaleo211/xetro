package com.retro.entity.teammember;

import java.util.List;

import com.retro.entity.member.Member;
import com.retro.entity.team.Team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@RepositoryRestResource(collectionResourceRel = "teamMember", path = "teamMember")
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
  @Query(value = "SELECT m FROM Member m WHERE m.id IN (SELECT tm.member.id FROM TeamMember tm WHERE tm.team.id = ?1)")
  List<Member> findMembersByTeamID(Long TeamID);

  @Query(value = "SELECT t FROM Team t WHERE t.id IN (SELECT tm.team.id FROM TeamMember tm WHERE tm.member.id = ?1)")
  List<Team> findTeamsByMemberID(Long MemberID);
}
