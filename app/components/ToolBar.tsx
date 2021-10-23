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
import { RouteComponentProps, withRouter } from 'react-router-dom';

const iconStyle = {
  fontSize: 20,
  color: '#222222',
};

const classNames = mergeStyleSets({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButton: {
    fontSize: 24,
    height: 24,
    width: 24,
    marginRight: 16,
  },
});

interface PropI extends RouteComponentProps{
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

interface StateI { }

class ToolBar extends React.Component<PropI, StateI> {
  constructor(props: any) {
    super(props);
    this.state = {};
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
    const { board, me, group, location } = this.props;

    const isFacilitator = (u: UserI, g:GroupI) => {
      return u.id === g.facilitatorID;
    }

    return location.pathname ==='/board' && group && board && board.stage !== 'archived' &&
      <div className={classNames.bar}>
        <IconButton
            primary
            className={classNames.iconButton}
            iconProps={{iconName: 'Refresh', style: iconStyle}}
            onClick={this.onRefreshBoard.bind(this)}
        />
        {isFacilitator(me, group) && <>
          {board.locked &&
            <IconButton
                primary
                className={classNames.iconButton}
                iconProps={{iconName: 'Permissions', style: iconStyle}}
                onClick={this.onUnlockBoard.bind(this)}
            />
          }
          {!board.locked &&
            <IconButton
                primary
                className={classNames.iconButton}
                iconProps={{iconName: 'Lock', style: iconStyle}}
                onClick={this.onLockBoard.bind(this)}
            />
          }
          {board.stage === 'created' &&
            <IconButton
                primary
                className={classNames.iconButton}
                iconProps={{iconName: 'archive', style: iconStyle}}
                onClick={this.onArchiveBoard.bind(this)}
            />
          }
        </>}
        {/* {board.video &&
          <IconButton
              primary
              className={classNames.iconButton}
              iconProps={{iconName: 'PresenceChickletVideo', style: iconStyle}}
          />
        } */}
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
)(withRouter(ToolBar));
