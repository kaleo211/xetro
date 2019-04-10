import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import { Avatar, Tooltip } from '@material-ui/core';
import { List, ListItem } from '@material-ui/core';

import { addUserToGroup } from '../actions/groupActions';
import { setActiveMember } from '../actions/boardActions';
import { setPage } from '../actions/localActions';

const styles = theme => ({
  active: {
    color: '#fff',
    backgroundColor: green[300],
    marginLeft: theme.spacing.unit * 1,
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
      this.props.setPage('');
    }
  }

  render() {
    const { group, classes } = this.props;
    let members = group ? group.members : [];
    return (
      <List dense>
        {members && members.map(m => (
          <Tooltip key={"side" + m.userId} title={m.firstName} placement="right" >
            <ListItem disableGutters button onClick={this.handleMemberSelect.bind(this, m.id)} >
              <Avatar className={classes.active}>
                {`${m.firstName.substring(0, 1).toUpperCase()}${m.lastName.substring(0, 1).toUpperCase()}`}
              </Avatar>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    );
  };
};

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
  withStyles(styles, { withTheme: true }),
)(MemberList);
