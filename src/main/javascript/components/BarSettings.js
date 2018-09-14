import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import {
  VpnKeyOutlined,
  LockOutlined,
  VoiceChat,
  SaveOutlined,
  RefreshRounded,
} from '@material-ui/icons';

import { patchBoard, selectBoard } from '../actions/boardActions';
import { selectTeam } from '../actions/boardActions';
import { openSnackBar, closeSnackBar, showPage } from '../actions/localActions';

const styles = theme => ({
});

class BarSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  handleBoardLock() {
    let updatedBoard = { locked: true };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.openSnackBar("Board is LOCKED.")
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.openSnackBar("Board is UNLOCKED.");
  }

  handleRefreshBoard() {
    this.props.selectBoard(this.props.board.id);
  }

  handleBoardFinish() {
    let updatedBoard = { finished: true };
    this.props.patchBoard(this.props.board, updatedBoard);
    this.props.showPage("boardCreate");
    this.props.openSnackBar("Board is ARCHIVED.");
    this.props.selectTeam(this.props.team.id);
  }

  render() {
    const { board } = this.props;
    return (
      <div>
        <Tooltip title="Refresh board" placement="bottom">
          <IconButton onClick={this.handleRefreshBoard.bind(this)} color="inherit">
            <RefreshRounded />
          </IconButton>
        </Tooltip>

        {board && board.facilitator && board.facilitator.video && (
          <Tooltip title="Open video chat" placement="bottom">
            <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
              <VoiceChat />
            </IconButton>
          </Tooltip>
        )}
        {board && !board.locked && (
          <Tooltip title="Lock board" placement="bottom">
            <IconButton onClick={this.handleBoardLock.bind(this)} color="inherit">
              <LockOutlined />
            </IconButton>
          </Tooltip>
        )}
        {board && board.locked && (
          <Tooltip title="Unlock board" placement="bottom">
            <IconButton onClick={this.handleBoardUnlock.bind(this)} color="inherit">
              <VpnKeyOutlined />
            </IconButton>
          </Tooltip>
        )}

        {board && !board.finished && (
          <Tooltip title="Archive board" placement="bottom">
            <IconButton onClick={this.handleBoardFinish.bind(this)} color="inherit">
              <SaveOutlined />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board
});

BarSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  patchBoard,
  openSnackBar,
  closeSnackBar,
  selectBoard,
  showPage,
  selectTeam,
})(withStyles(styles)(BarSettings));
