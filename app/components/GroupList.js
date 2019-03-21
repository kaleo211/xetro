import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { Add, Inbox } from '@material-ui/icons';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';

const styles = theme => ({
});

class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const { group, groups, me } = this.props;

    return (
      <List>
        <ListItem>
          <ListItemText primary={'MY GROUPs'} />
        </ListItem>

        {groups.map(g => (
          <ListItem button key={g.id}
            selected={group && group.id === g.id}
            onClick={this.handleSetGroup.bind(this, g.id)}
          >
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText primary={g.name} />
          </ListItem>
        ))}

        <ListItem button onClick={this.handleCreateGroup.bind(this)}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText primary={'Add a new group'} />
        </ListItem>

        {groups.map(g => (
          <ListItem button key={g.id}
            selected={group && group.id === g.id}
            onClick={this.handleSetGroup.bind(this, g.id)}
          >
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText primary={g.name} />
          </ListItem>
        ))}
      </List>
    )
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
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
