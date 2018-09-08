import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import {
  LockOutlined,
  LockOpenOutlined,
  VoiceChat,
  RefreshRounded,
} from '@material-ui/icons';

const styles = theme => ({

});

class Likes extends React.Component {
  constructor(props) {
    super(props);
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

        {board && (<div>
          {board.facilitator && board.facilitator.video && (
            <Tooltip title="Open video chat" placement="bottom">
              <IconButton onClick={this.handleVideoOpen.bind(this, board.facilitator.video)} color="inherit">
                <VoiceChat />
              </IconButton>
            </Tooltip>
          )}
          {!board.locked && (
            <Tooltip title="Lock board" placement="bottom">
              <IconButton onClick={this.handleBoardLock.bind(this)} color="inherit">
                <LockOpenOutlined />
              </IconButton>
            </Tooltip>
          )}
          {board.locked && (
            <Tooltip title="Unlock board" placement="bottom">
              <IconButton onClick={this.handleBoardUnlock.bind(this)} color="inherit">
                <LockOutlined />
              </IconButton>
            </Tooltip>
          )}
        </div>)}
      </div>
    );
  }
}

Likes.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Likes);
