import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Avatar, Badge } from '@material-ui/core';
import deepPurple from '@material-ui/core/colors/deepPurple';
import IconButton from '@material-ui/core/IconButton';
import { ChatRounded, Add, Clear } from '@material-ui/icons';
import { List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import { Menu, MenuItem } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { addUserToGroup } from '../actions/groupActions';
import { setActiveMember } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import { compose } from 'redux';

const styles = theme => ({
  avatar: {
    color: '#fff',
    backgroundColor: deepPurple[300],
    width: 30,
    height: 30,
    marginLeft: -3,
  },
});

class MemberList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  handleUserToAdd(userID) {
    this.props.addUserToGroup(this.props.group.id, userID);
    this.handleMenuClose();
  }

  handleMemberSelect(memberID) {
    if (this.props.group) {
      this.props.setActiveMember(memberID);
    } else {
      this.props.setPage("");
    }
  }

  render() {
    const { group, users, classes, board } = this.props;

    console.log('users:', users);
    console.log('group in MemberList:', group);

    let usersToShow = users;
    if (group) {
      usersToShow = group.members;
    }

    return (
      <List dense>
        {usersToShow && usersToShow.map(m => (
          < Tooltip key={"side" + m.userID} title={m.firstName} placement="right" >
            <ListItem button onClick={this.handleMemberSelect.bind(this, m.id)} >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {`${m.firstName.substring(0, 1).toUpperCase()}${m.lastName.substring(0, 1).toUpperCase()}`}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={m.firstName} />
              <ListItemSecondaryAction>
              </ListItemSecondaryAction>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    )
  }
}

const mapStateToProps = state => ({
  group: state.groups.group,
  users: state.users.users,
  members: state.groups.members,
  board: state.boards.board,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addUserToGroup: (tID, mID) => dispatch(addUserToGroup(tID, mID)),
    setActiveMember: (id) => dispatch(setActiveMember(id)),
    setPage: (page) => dispatch(setPage(page)),
  };
};

MemberList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(MemberList);
