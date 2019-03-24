import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { Add, Inbox, ExpandLess, ExpandMore, Clear } from '@material-ui/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import { Typography, withTheme } from '@material-ui/core';

const styles = theme => ({
});

class GroupList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }

  handleSetGroup(groupId) {
    this.props.setGroup(groupId);
  }

  handleCreateGroup() {
    this.props.setPage('createGroup');
  }

  handleLeaveGroup() {
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { group, me } = this.props;
    return (
      <List>
        <ListItem button onClick={this.handleClick}>
          <ListItemText disableTypography primary={<Typography variant="h6">My Groups</Typography>} />
          <ListItemSecondaryAction>
            <IconButton onClick={this.handleCreateGroup.bind(this)}>
              <Add />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          {me.groups && me.groups.map(g => (
            <ListItem button key={g.id}
              selected={group && group.id === g.id}
              onClick={this.handleSetGroup.bind(this, g.id)}
            >
              <ListItemText primary={g.name} />
            </ListItem>
          ))}
        </Collapse>

        {group && group.members.map(m => {
          <ListItem>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary={m.firstName} />
          </ListItem>
        })}
      </List>
    )
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setGroup: (id) => dispatch(setGroup(id)),
    setBoard: (id) => dispatch(setBoard(id)),
    setPage: (page) => dispatch(setPage(page)),
  };
};

GroupList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(GroupList);
