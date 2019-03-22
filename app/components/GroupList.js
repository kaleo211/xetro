import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { Add, Inbox, ExpandLess, ExpandMore } from '@material-ui/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';

const styles = theme => ({
});

class GroupList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }

  handleSetGroup(groupID) {
    this.props.setGroup(groupID);
    if (groupID === null) {
      this.props.setBoard(null);
      this.props.setPage('');
    }
  }

  handleCreateGroup() {
    this.props.setPage('createGroup');
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { group, me, drawOpened } = this.props;

    return (
      <List>
        {drawOpened && (<div>
          <ListItem button onClick={this.handleClick}>
            <ListItemText primary={'My groups'} />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            {me.groups && me.groups.map(g => (
              <ListItem button key={g.id}
                selected={group && group.id === g.id}
                onClick={this.handleSetGroup.bind(this, g.id)}
              >
                <ListItemIcon><Inbox /></ListItemIcon>
                <ListItemText primary={g.name} />
              </ListItem>
            ))}
          </Collapse>
        </div>)}

        <ListItem button onClick={this.handleCreateGroup.bind(this)}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary={'Add a new group'} />
        </ListItem>

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
  withStyles(styles),
)(GroupList);
