import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import {
  VpnKeyOutlined,
  LockOutlined,
  VoiceChat,
  SaveOutlined,
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

    this.state = {};
  }

  handleVideoOpen(url) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  handleLockBoard() {
    this.props.lockBoard(this.props.board.id);
    this.props.openSnackBar('Board is LOCKED.');
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
    this.props.openSnackBar('Board is ARCHIVED.');
    this.props.setGroup(this.props.group.id);
    this.props.setBoard(null);
  }

  handleActionCheck(action) {
    this.props.finishItem(action);
  }

  render() {
    const { board, page, classes } = this.props;

    return page === 'board' && board.stage !== 'archived' &&
      <div>
        {board.video &&
          <Tooltip title="Open Video Chat" placement="bottom">
            <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
              <VoiceChat />
            </IconButton>
          </Tooltip>
        }
        {board.stage === 'active' &&
          <Tooltip title="Archive Board" placement="bottom">
            <IconButton onClick={this.handleArchiveBoard.bind(this)} color="inherit">
              <SaveOutlined />
            </IconButton>
          </Tooltip>
        }
        {!board.locked &&
          <Tooltip title="Lock Board" placement="bottom">
            <IconButton onClick={this.handleLockBoard.bind(this)} color="inherit">
              <LockOutlined />
            </IconButton>
          </Tooltip>
        }
        {board.locked &&
          <Tooltip title="Unlock Board" placement="bottom">
            <IconButton onClick={this.handleUnlockBoard.bind(this)} color="inherit">
              <VpnKeyOutlined />
            </IconButton>
          </Tooltip>
        }
      </div>;
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  page: state.local.page,
});

const mapDispatchToProps = (dispatch) => ({
  setBoard: id => dispatch(setBoard(id)),
  setBoards: () => dispatch(setBoards()),
  setGroup: id => dispatch(setGroup(id)),
  openSnackBar: message => dispatch(openSnackBar(message)),
  setPage: page => dispatch(setPage(page)),
  archiveBoard: id => dispatch(archiveBoard(id)),
  lockBoard: id => dispatch(lockBoard(id)),
  unlockBoard: id => dispatch(unlockBoard(id)),
  finishItem: item => dispatch(finishItem(item)),
});

ActionBar.propTypes = {
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(ActionBar);
