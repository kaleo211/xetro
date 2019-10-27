import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { Grid, Toolbar, IconButton } from '@material-ui/core';
import { AccountBox, ViewWeekRounded } from '@material-ui/icons';

import { setBoard, postBoard } from '../actions/boardActions';
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

  handleCreateBoard() {
    const { activeBoard, group } = this.props;

    const now = new Date();
    const boardName = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;

    const newBoard = {
      stage: 'active',
      groupID: group.id,
      name: boardName,
    };

    if (activeBoard && activeBoard.facilitator) {
      newBoard.facilitatorID = activeBoard.facilitator.id;
    } else {
      const randomIndex = Math.floor(Math.random() * (group.members.length));
      newBoard.facilitatorID = group.members[randomIndex].id;
    }

    this.props.postBoard(newBoard);
    this.props.setPage('board');
  }

  render() {
    const { me, group, board, page, activeBoard, classes } = this.props;

    const enterBoard = () => {
      if (activeBoard) {
        return (
          <IconButton color="inherit" onClick={this.handleJoinBoard.bind(this)}>
            <ViewWeekRounded fontSize="large" />
          </IconButton>
        );
      }
      return (
        <IconButton color="inherit" onClick={this.handleCreateBoard.bind(this)}>
          <ViewWeekRounded fontSize="large" />
        </IconButton>
      );
    };

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
            {page === 'group' && enterBoard()}
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
  postBoard: (board) => dispatch(postBoard(board)),
});

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Menu);
