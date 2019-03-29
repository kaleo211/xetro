import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { CheckRounded } from '@material-ui/icons';

import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';

const styles = theme => ({
  nested: {
    marginLeft: theme.spacing.unit * 1,
  },
});

class ActionItemList extends React.Component {
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
  }

  render() {
    const { group, me, classes } = this.props;
    return (
      <List>
        <ListItem button onClick={this.handleClick}>
          <ListItemText disableTypography primary={<Typography variant="h6">My Actions</Typography>} />
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          {me.actions && me.actions.map(action =>
            <ListItem button key={action.id} className={classes.nested} >
              <ListItemText primary={action.title} />
              <ListItemSecondaryAction>
                <IconButton aria-label="Delete">
                  <CheckRounded />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
        </Collapse>
      </List>
    );
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

ActionItemList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(ActionItemList);
