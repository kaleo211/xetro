import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { setGroup } from '../actions/groupActions';
import { setPage } from '../actions/localActions';

const styles = theme => ({
  nested: {
    marginLeft: theme.spacing.unit * 1,
  },
});

class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSetGroup(groupId) {
    this.props.setGroup(groupId);
  }

  handleCreateGroup() {
    this.props.setPage('createGroup');
  }

  handleLeaveGroup() {
  }

  render() {
    const { groups, group, classes } = this.props;

    return (
      <List>
        {groups && groups.map(g => (
          <ListItem
            button
            key={g.id}
            className={classes.nested}
            selected={group && group.id === g.id}
            onClick={this.handleSetGroup.bind(this, g.id)}
          >
            <ListItemText disableTypography primary={<Typography variant="h6">{g.name}</Typography>} />
          </ListItem>
        ))}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
});
const mapDispatchToProps = (dispatch) => ({
  setGroup: (id) => dispatch(setGroup(id)),
  setPage: (page) => dispatch(setPage(page)),
});

GroupList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(GroupList);
