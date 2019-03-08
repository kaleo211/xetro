import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Avatar, Badge } from '@material-ui/core';
import deepPurple from '@material-ui/core/colors/deepPurple';
import IconButton from '@material-ui/core/IconButton';
import { ChatRounded, Add } from '@material-ui/icons';
import { List, ListItem, ListItemAvatar } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';

import { addMemberToTeam } from '../actions/teamActions';
import { updateSelectedMember } from '../actions/boardActions';
import { showPage } from '../actions/localActions';
import { compose } from 'redux';

const styles = theme => ({
  purpleAvatar: {
    color: '#fff',
    backgroundColor: deepPurple[300],
  },
});

class MemberList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleMemberAddClick(evt) {
    this.setState({ anchorEl: evt.currentTarget });
  }

  handleUserAddClick() {
    this.props.showPage("userCreate");
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  handleMemberToAdd(memberID) {
    this.props.addMemberToTeam(this.props.team.id, memberID);
    this.handleMenuClose();
  }

  handleMemberSelect(memberID) {
    if (this.props.team) {
      this.props.updateSelectedMember(memberID);
    } else {
      this.props.showPage("");
    }
  }

  render() {
    const { team, users, members, classes, selectedMember, board, memberIDs } = this.props;
    const { anchorEl } = this.state;

    let usersToShow = users;
    if (team) {
      usersToShow = members;
    }

    const isFacilitator = (m) => {
      return board && board.facilitator && board.facilitator.userID === m.userID;
    }
    const isSelected = (m) => {
      return team && selectedMember && selectedMember.userID === m.userID;
    }

    return (<div>
      <List component="nav" style={{ marginLeft: -6 }}>
        {usersToShow && usersToShow.map(m => (
          < Tooltip key={"side" + m.userID} title={m.firstName} placement="right" >
            <ListItem
              button
              onClick={this.handleMemberSelect.bind(this, m.id)}
              style={{ paddingTop: 16, paddingBottom: 16 }}>
              <ListItemAvatar>
                {isSelected(m) ?
                  <Badge
                    badgeContent={<ChatRounded color="primary" style={{ fontSize: 20 }} />}>
                    <Avatar className={isFacilitator(m) ? classes.purpleAvatar : null}>{m.userID}</Avatar>
                  </Badge> :
                  <Avatar className={isFacilitator(m) ? classes.purpleAvatar : null}>{m.userID}</Avatar>}
              </ListItemAvatar>
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <div style={{ marginLeft: 13 }}>
        {team ?
          <Tooltip title="Add an team member" placement="right">
            <IconButton onClick={this.handleMemberAddClick.bind(this)}>
              <Add />
            </IconButton>
          </Tooltip> :
          <Tooltip title="Add an user" placement="right">
            <IconButton onClick={this.handleUserAddClick.bind(this)}>
              <Add />
            </IconButton>
          </Tooltip>}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose.bind(this)} >
          {team && memberIDs && users && users.map(user => (!memberIDs.includes(user.id) &&
            <MenuItem key={user.id} onClick={this.handleMemberToAdd.bind(this, user.id)}>
              {user.firstName + " " + user.lastName}
            </MenuItem>))}
        </Menu>
      </div>
    </div>)
  }
}

const mapStateToProps = state => ({
  team: state.teams.team,
  users: state.users.users,
  memberIDs: state.teams.memberIDs,
  members: state.teams.members,
  selectedMember: state.boards.selectedMember,
  board: state.boards.board,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addMemberToTeam: (tID, mID) => dispatch(addMemberToTeam(tID, mID)),
    updateSelectedMember: (id) => dispatch(updateSelectedMember(id)),
    showPage: (page) => dispatch(showPage(page)),
  };
};

MemberList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(MemberList);