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

import { addUserToGroup } from '../actions/groupActions';
import { setActiveMember } from '../actions/boardActions';
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

  handleMenuClose() {
    this.setState({ anchorEl: null });
  }

  handleUserToAdd(userID) {
    this.props.addUserToGroup(this.props.group.id, userID);
    this.handleMenuClose();
  }

  handleMemberSelect(memberID) {
    if (this.props.group) {
      this.props.setActiveMember(memberID);
    } else {
      this.props.showPage("");
    }
  }

  render() {
    const { group, users, members, classes, activeMember, board, memberIDs } = this.props;
    const { anchorEl } = this.state;

    console.log('users:', users);
    console.log('group:', group);

    let usersToShow = users;
    if (group) {
      usersToShow = members;
    }

    const isFacilitator = (m) => {
      return board && board.facilitator && board.facilitator.userID === m.userID;
    }
    const isSelected = (m) => {
      return group && activeMember && activeMember.userID === m.userID;
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
        {group ?
          <Tooltip title="Add an user to group" placement="right">
            <IconButton onClick={this.handleMemberAddClick.bind(this)}>
              <Add />
            </IconButton>
          </Tooltip> : <div></div>
        }
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose.bind(this)} >
          {group && users && users.map(u =>
            (group.members || group.members.map(m => { return u.id !== m.id; })) &&
            <MenuItem key={u.id} onClick={this.handleUserToAdd.bind(this, u.id)}>
              {u.firstName + " " + u.lastName}
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>)
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  users: state.users.users,
  members: state.groups.members,
  activeMember: state.boards.activeMember,
  board: state.boards.board,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addUserToGroup: (tID, mID) => dispatch(addUserToGroup(tID, mID)),
    setActiveMember: (id) => dispatch(setActiveMember(id)),
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
