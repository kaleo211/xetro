import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Grid, Toolbar, IconButton } from '@material-ui/core';
import { AccountBox, ViewWeekRounded } from '@material-ui/icons';

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

  handleOpenHome() {
    this.props.setPage('home');
  }

  handleJoinBoard() {
    this.props.setBoard(this.props.activeBoard.id);
    this.props.setPage('board');
  }

  render() {
    const { me, group, board, page, classes } = this.props;

    return (
      <Toolbar disableGutters>
        <IconButton color="inherit" onClick={this.handleOpenHome.bind(this)}>
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
            {page === 'group' &&
              <IconButton color="inherit" onClick={this.handleJoinBoard.bind(this)}>
                <ViewWeekRounded fontSize="large" />
              </IconButton>
            }
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
  page: state.local.page,
  activeBoard: state.boards.activeBoard,
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
