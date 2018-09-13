import { FETCH_TEAMS, SELECT_TEAM, ADD_MEMBER_TO_TEAM } from './types';
import Utils from '../components/Utils';

export const fetchTeams = () => dispatch => {
  Utils.fetchResource("teams", (body => {
    dispatch({
      type: FETCH_TEAMS,
      payload: body._embedded.teams
    });
  }));
};

export const selectTeam = (teamID) => dispatch => {
  Utils.fetchResource("teams/" + teamID, (body => {
    let team = Utils.reformTeam(body);
    Utils.fetchResource("teamMember/team/" + teamID, (body => {
      let members = body._embedded.members;
      dispatch({
        type: SELECT_TEAM,
        team,
        members
      });
    }));
  }));
};

export const addMemberToTeam = (teamID, memberID) => dispatch => {
  let teamMember = {
    team: Utils.appendLink("teams/" + teamID),
    member: Utils.appendLink("members/" + memberID),
  }

  Utils.postTeamMember(teamMember, (body => {
    Utils.fetchResource("teamMember/team/" + teamID, body => {
      let members = body._embedded.members;
      dispatch({
        type: ADD_MEMBER_TO_TEAM,
        members
      })
    })
  }));
};
