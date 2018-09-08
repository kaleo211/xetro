import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import {
  VpnKeyOutlined,
  LockOutlined,
  VoiceChat,
  RefreshRounded,
} from '@material-ui/icons';

const styles = theme => ({

});

class Likes extends React.Component {
  constructor(props) {
    super(props);
  }

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  render() {
    const { board } = this.props;
    return (
      <div>
        <Tooltip title="Refresh board" placement="bottom">
          <IconButton onClick={this.updatePillars} color="inherit">
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
            <IconButton onClick={this.props.handleBoardLock} color="inherit">
              <LockOutlined />
            </IconButton>
          </Tooltip>
        )}
        {board && board.locked && (
          <Tooltip title="Unlock board" placement="bottom">
            <IconButton onClick={this.props.handleBoardUnlock} color="inherit">
              <VpnKeyOutlined />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  }
}

Likes.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Likes);
