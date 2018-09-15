import { FETCH_TEAMS, SELECT_TEAM, ADD_MEMBER_TO_TEAM, POST_TEAM } from './types';
import Utils from '../components/Utils';

export const fetchTeams = () => dispatch => {
  Utils.fetchResource("teams", (body => {
    let teams = body._embedded && body._embedded.teams || [];
    dispatch({
      type: FETCH_TEAMS,
      teams,
    });
  }));
};

export const postTeam = (updatedTeam) => dispatch => {
  Utils.postResource("teams", updatedTeam, (body1) => {
    let team = Utils.reform(body1);
    console.log("returned team", team);
    Utils.fetchResource("teams", (body => {
      let teams = body._embedded && body._embedded.teams || [];
      dispatch({
        type: POST_TEAM,
        teams,
        team,
      });
    }));
  });
}

export const selectTeam = (teamID) => dispatch => {
  if (teamID) {
    Utils.fetchResource("teams/" + teamID, (body => {
      let team = Utils.reformTeam(body);
      Utils.fetchResource("teamMember/team/" + teamID, (body => {
        let members = body._embedded && body._embedded.members || [];
        dispatch({
          type: SELECT_TEAM,
          team,
          members,
        });
      }));
    }));
  } else {
    dispatch({
      type: SELECT_TEAM,
      team: null,
      members: [],
    })
  }
};

export const addMemberToTeam = (teamID, memberID) => dispatch => {
  let teamMember = {
    team: Utils.prepend("teams/" + teamID),
    member: Utils.prepend("members/" + memberID),
  }

  Utils.postTeamMember(teamMember, (body => {
    Utils.fetchResource("teamMember/team/" + teamID, body => {
      let members = body._embedded && body._embedded.members || [];
      dispatch({
        type: ADD_MEMBER_TO_TEAM,
        members
      })
    })
  }));
};
