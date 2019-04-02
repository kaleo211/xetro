import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { Search } from '@material-ui/icons';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import GroupList from './GroupList';
import ActionItemList from './ActionItemList';

const styles = theme => ({
  nested: {
    marginLeft: theme.spacing.unit * 1,
  },
});

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: '',
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

  handleClick(expand) {
    this.setState(state => ({ expand: state.expand === expand ? '' : expand }));
  };

  render() {
    const { group, groups, me, classes } = this.props;
    const { expand } = this.state;

    console.log('members:', group && group.members, groups);

    return (me &&
      <List disablePadding>
        <ListItem button selected={expand === 'group'} onClick={this.handleClick.bind(this, 'group')}>
          <ListItemText
            primary={<Typography variant="h6">My Groups</Typography>}
            secondary={(group == null || groups.length === 0) ? 'click magnifier to join a group' : ''}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={this.handleCreateGroup.bind(this)}>
              <Search />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={expand === 'group'} timeout="auto" unmountOnExit>
          <GroupList />
        </Collapse>
        <Divider />
        <ListItem button selected={expand === 'action'} onClick={this.handleClick.bind(this, 'action')}>
          <ListItemText
            primary={<Typography variant="h6">My Actions</Typography>}
            secondary={me.actions.length === 0 ? 'no actions' : ''}
          />
        </ListItem>
        <Collapse in={expand === 'action'} timeout="auto" unmountOnExit>
          <ActionItemList />
        </Collapse>
      </List>
    );
  };
};

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

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Sidebar);
