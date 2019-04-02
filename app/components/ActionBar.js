import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { Tooltip, Avatar, Grid } from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import {
  VpnKeyOutlined,
  LockOutlined,
  VoiceChat,
  SaveOutlined,
  RefreshRounded,
  Assignment,
  CheckRounded,
  AssignmentTurnedInOutlined,
} from '@material-ui/icons';

import { setBoard, setBoards, archiveBoard, lockBoard, unlockBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import { openSnackBar, setPage } from '../actions/localActions';
import { finishItem } from '../actions/itemActions';

const styles = theme => ({
});

class ActionBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
    }

    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
  }

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  handleLockBoard() {
    this.props.lockBoard(this.props.board.id);
    this.props.openSnackBar('Board is LOCKED.')
  }

  handleUnlockBoard() {
    this.props.unlockBoard(this.props.board.id);
    this.props.openSnackBar('Board is UNLOCKED.');
  }

  handleRefreshBoard() {
    this.props.setBoard(this.props.board.id);
  }

  handleViewHistory() {
    this.props.setBoards();
    this.props.setPage('boardList');
  }

  handleArchiveBoard() {
    this.props.archiveBoard(this.props.board.id);
    this.props.setPage('createBoard');
    this.props.openSnackBar('Board is ARCHIVED.');
    this.props.setGroup(this.props.group.id);
    this.props.setBoard(null);
  }

  handleDialogClose() {
    this.setState({ dialogOpen: false });
  }

  handleDialogOpen() {
    this.setState({ dialogOpen: true });
  }

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  render() {
    const { board, classes } = this.props;
    let actions = board.actions;

    return (<div>
      {board.video && (
        <Tooltip title="Open Video Chat" placement="bottom">
          <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
            <VoiceChat />
          </IconButton>
        </Tooltip>)}
      {board.stage === 'active' && (
        <Tooltip title="Archive Board" placement="bottom">
          <IconButton onClick={this.handleArchiveBoard.bind(this)} color="inherit">
            <SaveOutlined />
          </IconButton>
        </Tooltip>
      )}
      {!board.locked && (
        <Tooltip title="Lock Board" placement="bottom">
          <IconButton onClick={this.handleLockBoard.bind(this)} color="inherit">
            <LockOutlined />
          </IconButton>
        </Tooltip>)}
      {board.locked && (
        <Tooltip title="Unlock Board" placement="bottom">
          <IconButton onClick={this.handleUnlockBoard.bind(this)} color="inherit">
            <VpnKeyOutlined />
          </IconButton>
        </Tooltip>)}
      <Tooltip title="Show Actions" placement="bottom">
        <IconButton onClick={this.handleDialogOpen} color="inherit">
          <AssignmentTurnedInOutlined />
        </IconButton>
      </Tooltip>

      <Dialog fullWidth
        open={this.state.dialogOpen}
        onClose={this.handleDialogClose}
      >
        <DialogTitle>
          {actions && actions.length > 0 ? "Actions" : "No Actions"}
        </DialogTitle>
        <DialogContent>
          <List>
            {actions.map(action => (
              <ListItem divider button
                key={"actionToCheck" + action.id}
                disabled={action.stage === 'done'}
              >
                <Avatar>{action.ownerId}</Avatar>
                <ListItemText primary={action.title} />
                <ListItemSecondaryAction onClick={this.handleActionCheck.bind(this, action)}>
                  <IconButton><CheckRounded /></IconButton>
                </ListItemSecondaryAction>
              </ListItem>))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDialogClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </div>);
  }
}

const mapStateToProps = (state) => ({
  board: state.boards.board,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setBoard: (id) => dispatch(setBoard(id)),
    setBoards: () => dispatch(setBoards()),
    setGroup: (id) => dispatch(setGroup(id)),
    openSnackBar: (message) => dispatch(openSnackBar(message)),
    setPage: (page) => dispatch(setPage(page)),
    archiveBoard: (id) => dispatch(archiveBoard(id)),
    lockBoard: (id) => dispatch(lockBoard(id)),
    unlockBoard: (id) => dispatch(unlockBoard(id)),
    finishItem: (item) => dispatch(finishItem(item)),
  };
};

ActionBar.propTypes = {
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ActionBar);
