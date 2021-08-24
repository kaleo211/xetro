import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { IconButton } from '@fluentui/react';

import { setBoard, setBoards, archiveBoard, lockBoard, unlockBoard, refreshBoard } from '../store/board/action';
import { setGroup } from '../store/group/action';
import { finishItemThunk } from '../store/item/action';
import { BoardI, GroupI, UserI } from '../../types/models';
import { ApplicationState } from '../store/types';
import { useLocation } from 'react-router-dom';

const iconStyle = {
  fontSize: 20,
  color: '#222222',
};

const classNames = mergeStyleSets({
  iconButton: {
    fontSize: 24,
    height: 24,
    width: 24,
    marginRight: 16,
  },
});

interface PropI {
  group: GroupI;
  board: BoardI;
  me: UserI;

  archiveBoard(id: string): Promise<void>;
  finishItemThunk(): Promise<void>;
  lockBoard(id:string): Promise<void>;
  refreshBoard(): Promise<void>;
  setBoard(id: string): Promise<void>;
  setBoards(): Promise<void>;
  setGroup(id: string): Promise<void>;
  unlockBoard(id:string): Promise<void>;
}

interface StateI {
  path: string
}

class ToolBar extends React.Component<PropI, StateI> {
  constructor(props: any) {
    super(props);
    this.state = {
      path: useLocation().pathname
    };
  }

  onVideoOpen(url:string) {
    const win = window.open(url, '_blank');
    win.focus();
  }

  async onRefreshBoard() {
    await this.props.refreshBoard();
  }

  async onArchiveBoard() {
    await this.props.archiveBoard(this.props.board.id);
    await this.props.setGroup(this.props.group.id);
    this.props.setBoard(null);
  }

  onLockBoard() {
    this.props.lockBoard(this.props.board.id);
  }

  onUnlockBoard() {
    this.props.unlockBoard(this.props.board.id);
  }

  render() {
    const { board, me, group } = this.props;
    const { path } = this.state;

    const isFacilitator = me.id === group.facilitatorID;

    return path ==='/board' && board && board.stage !== 'archived' &&
      <div style={{ marginLeft: 8 }}>
        <IconButton
            primary
            className={classNames.iconButton}
            iconProps={{iconName: 'Refresh', style: iconStyle}}
            onClick={this.onRefreshBoard.bind(this)}
        />
        {board.locked && isFacilitator &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'Permissions', style: iconStyle}}
              onClick={this.onUnlockBoard.bind(this)}
          />
        }
        {!board.locked && isFacilitator &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'Lock', style: iconStyle}}
              onClick={this.onLockBoard.bind(this)}
          />
        }
        {/* {board.video &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'PresenceChickletVideo', style: iconStyle}}
          />
        } */}
        {board.stage === 'created' && isFacilitator &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'archive', style: iconStyle}}
              onClick={this.onArchiveBoard.bind(this)}
          />
        }
      </div>;
  }
}

const mapStateToProps = (state:ApplicationState) => ({
  group: state.group.group,
  board: state.board.board,
  me: state.user.me,
});
const mapDispatchToProps = { archiveBoard, finishItemThunk, lockBoard, setBoard, setBoards, setGroup, unlockBoard, refreshBoard };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ToolBar);
