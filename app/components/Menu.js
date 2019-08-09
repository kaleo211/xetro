import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Grid, Toolbar, IconButton } from '@material-ui/core';
import { AccountBox } from '@material-ui/icons';

import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import ActionBar from './ActionBar';

const styles = theme => ({
});

class Menu extends React.Component {
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

  handleOpenHome() {
    this.props.setPage('home');
  }

  render() {
    const { me, group, board, classes } = this.props;

    return (
      <Toolbar disableGutters>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={this.handleOpenHome.bind(this)}
        >
          <AccountBox fontSize="large" />
        </IconButton>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          direction="row"
          className={classes.bar}
        >
          <Grid container alignItems="center" item md={5}>
            <Grid item>
              <Typography variant="h3" color="inherit" noWrap>
                {group ? `#${group.name}` : me.firstName}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item justify="flex-end" md={6}>
            {board && <ActionBar />}
          </Grid>
        </Grid>
      </Toolbar>
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
  setBoard: (id) => dispatch(setBoard(id)),
  setPage: (page) => dispatch(setPage(page)),
});

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Menu);
