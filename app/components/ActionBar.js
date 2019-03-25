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
  HistoryRounded,
} from '@material-ui/icons';

import { patchBoard, setBoard, setBoards, archiveBoard, lockBoard, unlockBoard } from '../actions/boardActions';
import { setGroup } from '../actions/groupActions';
import { openSnackBar, setPage } from '../actions/localActions';
import { patchAction } from '../actions/itemActions';

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
    this.props.patchAction("actions/" + action.id, { finished: true })
      .then(() => {
        this.props.setGroup(this.props.group.id);
      });
  }

  render() {
    const { board, group } = this.props;

    const members = group ? group.members : [];

    const membersWithActions = members.filter(member =>
      member.actions && member.actions.filter(action =>
        !action.finished && action.group.id === group.id
      ).length > 0
    );

    return (<div>
      <Tooltip title="Show board history" placement="bottom">
        <IconButton id="historyButton" onClick={this.handleViewHistory.bind(this)} color="inherit">
          <HistoryRounded />
        </IconButton>
      </Tooltip>
      {board && (
        <Tooltip title="Refresh board" placement="bottom">
          <IconButton id="refreshButton" onClick={this.handleRefreshBoard.bind(this)} color="inherit">
            <RefreshRounded />
          </IconButton>
        </Tooltip>)}
      {board && board.video && (
        <Tooltip title="Open Video Chat" placement="bottom">
          <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
            <VoiceChat />
          </IconButton>
        </Tooltip>)}
      {board && (
        <Tooltip title="Show Actions" placement="bottom">
          <IconButton onClick={this.handleDialogOpen} color="inherit">
            <Assignment />
          </IconButton>
        </Tooltip>)}
      {board && !board.locked && (
        <Tooltip title="Lock Board" placement="bottom">
          <IconButton onClick={this.handleLockBoard.bind(this)} color="inherit">
            <LockOutlined />
          </IconButton>
        </Tooltip>)}
      {board && board.locked && (
        <Tooltip title="Unlock Board" placement="bottom">
          <IconButton onClick={this.handleUnlockBoard.bind(this)} color="inherit">
            <VpnKeyOutlined />
          </IconButton>
        </Tooltip>)}
      {board && board.stage === 'active' && (
        <Tooltip title="Archive Board" placement="bottom">
          <IconButton onClick={this.handleArchiveBoard.bind(this)} color="inherit">
            <SaveOutlined />
          </IconButton>
        </Tooltip>)}

      <Dialog fullWidth
        open={this.state.dialogOpen}
        onClose={this.handleDialogClose}
      >
        <DialogTitle>
          {membersWithActions && membersWithActions.length > 0 ? "Actions" : "No Actions"}
        </DialogTitle>
        <DialogContent>
          <Grid container justify="flex-start" spacing={16}>
            {membersWithActions.map(member => (
              <Grid item xs={12} key={"action" + member.userId}>
                <List>
                  {member.actions && member.actions.filter(ac => ac.group.id === group.id && !ac.finished).map((a, idx) => (
                    <ListItem divider key={"actionToCheck" + a.id} button >
                      <Avatar style={{ backgroundColor: idx === 0 || 'rgba(0, 0, 0, 0)' }}>{member.userId}</Avatar>
                      <ListItemText primary={a.title} />
                      <ListItemSecondaryAction onClick={this.handleActionCheck.bind(this, a)}>
                        <IconButton><CheckRounded /></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>))}
                </List>
              </Grid>))}
          </Grid>
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
  group: state.groups.group,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setBoard: (id) => dispatch(setBoard(id)),
    setBoards: () => dispatch(setBoards()),
    setGroup: (id) => dispatch(setGroup(id)),
    patchAction: (link, updatedAction) => dispatch(patchAction(link, updatedAction)),
    openSnackBar: (message) => dispatch(openSnackBar(message)),
    setPage: (page) => dispatch(setPage(page)),
    archiveBoard: (id) => dispatch(archiveBoard(id)),
    lockBoard: (id) => dispatch(lockBoard(id)),
    unlockBoard: (id) => dispatch(unlockBoard(id)),
  };
};

ActionBar.propTypes = {
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ActionBar);
