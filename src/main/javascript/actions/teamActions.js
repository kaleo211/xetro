import { FETCH_TEAMS, SELECT_TEAM, ADD_MEMBER_TO_TEAM, POST_TEAM } from './types';
import Utils from '../components/Utils';

export const fetchTeams = () => {
  return (dispatch) => {
    Utils.fetchResource("teams").then(body => {
      let teams = body._embedded && body._embedded.teams || [];
      dispatch({
        type: FETCH_TEAMS,
        teams,
      });
    });
  };
};

export const postTeam = (updatedTeam) => {
  return (dispatch) => {
    Utils.postResource("teams", updatedTeam).then(body1 => {
      let team = Utils.reform(body1);
      Utils.fetchResource("teams").then(body => {
        let teams = body._embedded && body._embedded.teams || [];
        dispatch({
          type: POST_TEAM,
          teams,
          team,
        });
      });
    });
  };
}

export const selectTeam = (teamID) => {
  return (dispatch) => {
    if (teamID) {
      Utils.fetchResource("teams/" + teamID).then(body => {
        let team = Utils.reformTeam(body);
        Utils.fetchResource("teamMember/team/" + teamID).then(body => {
          let members = body._embedded && body._embedded.members || [];
          let memberIDs = [];
          members.map(m => {
            memberIDs.push(m.id);
          });
          dispatch({
            type: SELECT_TEAM,
            team,
            members,
            memberIDs,
          });
        });
      });
    } else {
      dispatch({
        type: SELECT_TEAM,
        team: null,
        members: [],
      });
    }
  };
};

export const addMemberToTeam = (teamID, memberID) => {
  let teamMember = {
    team: Utils.prepend("teams/" + teamID),
    member: Utils.prepend("members/" + memberID),
  }

  return (dispatch) => {
    Utils.postTeamMember(teamMember).then(b => {
      Utils.fetchResource("teamMember/team/" + teamID).then(body => {
        let members = body._embedded && body._embedded.members || [];
        let memberIDs = [];
        members.map(m => {
          memberIDs.push(m.id);
        });
        dispatch({
          type: ADD_MEMBER_TO_TEAM,
          members,
          memberIDs,
        });
      });
    });
  };
};
