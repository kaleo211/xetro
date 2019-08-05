import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { Paper, Grid } from '@material-ui/core';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';

import ActionItemList from './ActionItemList';
import GroupList from './GroupList';
import NewGroup from './NewGroup';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 1,
  },
  divider: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
  },
  iconButton: {
    padding: 0,
  },
});

class Group extends React.Component {
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
  }

  render() {
    const { me, classes } = this.props;

    return (me &&
      <div>
        <Paper className={classes.paper}>
          <Typography variant="h4">{`${me.lastName} ${me.firstName}`}</Typography>
        </Paper>

        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="flex-start">
            <Grid item md={2}>
              <Typography variant="h6">Join Group</Typography>
            </Grid>
            <Grid item md={4}>
              <NewGroup />
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="flex-start">
            <Grid item md={2}>
              <Typography variant="h6">My Groups</Typography>
            </Grid>
            <Grid item md={4}>
              <GroupList />
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.paper}>
          <Grid container direction="row" alignItems="flex-start">
            <Grid item md={2}>
              <Typography variant="h6">My Actions</Typography>
            </Grid>
            <Grid item md={4}>
              <ActionItemList />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
  board: state.boards.board,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => ({
  setGroup: (id) => dispatch(setGroup(id)),
  setBoard: (id) => dispatch(setBoard(id)),
  setPage: (page) => dispatch(setPage(page)),
});

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Group);
