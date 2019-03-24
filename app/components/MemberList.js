import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';

import { Avatar, Tooltip } from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import { addUserToGroup } from '../actions/groupActions';
import { setActiveMember } from '../actions/boardActions';
import { setPage } from '../actions/localActions';

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
  }

  handleUserToAdd(userId) {
    this.props.addUserToGroup(this.props.group.id, userId);
  }

  handleMemberSelect(memberID) {
    if (this.props.group) {
      this.props.setActiveMember(memberID);
    } else {
      this.props.setPage("");
    }
  }

  render() {
    const { group, classes } = this.props;
    let members = group ? group.members : [];

    return (
      <List dense>
        {members && members.map(m => (
          < Tooltip key={"side" + m.userId} title={m.firstName} placement="right" >
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
