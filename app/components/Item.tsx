import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { DocumentCard, DocumentCardTitle, IconButton, ProgressIndicator, Persona, PersonaSize, Text, Overlay, CommandButton } from '@fluentui/react';
import { Depths } from '@fluentui/theme/lib/effects/FluentDepths';

import { setActiveItem, showTasks, hideTasks, showAddingTask, setHoverItem, startActiveItemTimer, clearActiveItemTimer } from '../store/local/action';
import { deleteItemThunk, likeItemThunk, finishItemThunk, startItemThunk } from '../store/item/action';
import Task from './Task';
import { BoardI, ItemI, PillarI } from '../../types/models';
import { ApplicationState } from '../store/types';
import { Keyable } from '../../types/common';

const iconStyle = {
  fontSize: 18,
  color: '#222222',
};

const classes = mergeStyleSets({
  card: {
    maxWidth: '33vw',
    minWidth: 320,
    marginTop: 4,
    ':hover': {
      boxShadow: Depths.depth8,
    },
  },
  taskCard: {
    maxWidth: '33vw',
    marginTop: 2,
    minHeight: 40,
    minWidth: 290,
    display: 'flex',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 4,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'space-between',
    backgroundColor: '#fdfcfb',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  titleTextDone:{
    textDecorationLine: 'line-through',
  },
  tasks: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 4,
  },
  iconButton: {
    marginTop: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: -14,
    right: -14,
  },
  progress: {
    marginTop: 40,
  },
});

interface PropsI {
  activeItemProgress: number,
  addingTask: boolean

  activeItem: ItemI
  board: BoardI
  hoveredItem: ItemI
  pillar: PillarI
  showTaskMap: Keyable

  clearActiveItemTimer(): void
  deleteItemThunk(item: ItemI): Promise<void>
  finishItemThunk(item: ItemI): Promise<void>
  hideTasks(id: string): void
  likeItemThunk(item: ItemI): Promise<void>
  setActiveItem(Item: ItemI): void
  setHoverItem(item: ItemI): void
  showTasks(id: string): void
  showAddingTask(): void
  startActiveItemTimer(): void
  startItemThunk(item: ItemI): Promise<void>
}

interface StateI {}

class Pillar extends React.Component<PropsI, StateI> {
  constructor(props:any) {
    super(props);
    this.state = {};
  }

  async ondeleteItem(item:ItemI) {
    await this.props.deleteItemThunk(item);
  }

  async onstartItemThunk(item:ItemI, evt:React.MouseEvent) {
    evt.stopPropagation();
    const { activeItem } = this.props;
    if (activeItem != null) {
      await this.props.finishItemThunk(activeItem);
    }
    await this.props.startItemThunk(item);

    this.props.startActiveItemTimer();
  }

  onlikeItemThunk(item:ItemI, evt:React.MouseEvent) {
    evt.stopPropagation();
    this.props.likeItemThunk(item);
  }

  async onfinishItemThunk(item:ItemI) {
    await this.props.clearActiveItemTimer();
    await this.props.finishItemThunk(item);
  }

  async onClickAddTaskButton(item:ItemI) {
    this.props.setActiveItem(item);
    this.props.showAddingTask();
  }

  onHideTasks(item:ItemI) {
    this.props.hideTasks(item.id);
  }

  onShowTasks(item:ItemI) {
    this.props.showTasks(item.id);
  }

  onHoverItem(item:ItemI) {
    this.props.setHoverItem(item);
  }

  onLeaveHoveredItem() {
    this.props.setHoverItem(null);
  }

  render() {
    const { activeItem, activeItemProgress, hoveredItem, pillar, board, showTaskMap, addingTask } = this.props;
    const items = pillar.items;

    const showTimer = (item:ItemI) => {
      return board.locked && board.stage === 'created' && item.stage === 'created';
    };
    const showFinishButton = (item:ItemI) => {
      return board.locked && board.stage === 'created' && item.stage === 'active';
    };
    const showTaskButton = (item:ItemI) => {
      return board.locked && board.stage === 'created' && item.stage !== 'created';
    };
    const showAddTask = (item:ItemI) => {
      return board.locked && board.stage === 'created' && addingTask;
    };
    const showFoldButton = (item:ItemI) => {
      return item.tasks.length > 0;
    };

    return items.map(item => item && (
      <div key={item.id}>
        <DocumentCard
            key={item.id}
            className={classes.card}
            onMouseOver={this.onHoverItem.bind(this, item)}
            onMouseLeave={this.onLeaveHoveredItem.bind(this)}
        >
          {!board.locked && hoveredItem && hoveredItem.id===item.id &&
            <IconButton
                primary
                className={classes.deleteButton}
                iconProps={{ iconName: 'Cancel', style: {fontSize: 12, color: 'red'} }}
                onClick={this.ondeleteItem.bind(this, item)}
            />
          }
          <div className={classes.title}>
            <DocumentCardTitle
                title={item.title}
                className={item.stage !== 'done' ? classes.titleText : classes.titleTextDone}
            />
            <div className={classes.tasks}>
              {showFoldButton(item) && (
                typeof showTaskMap[item.id] === 'undefined' || !showTaskMap[item.id] ?
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'ChevronUp', style: iconStyle }}
                      onClick={this.onShowTasks.bind(this, item)}
                  /> :
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'ChevronDown', style: iconStyle }}
                      onClick={this.onHideTasks.bind(this, item)}
                  />
              )}
              {showTimer(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'Stopwatch', style: iconStyle }}
                    onClick={this.onstartItemThunk.bind(this, item)}
                />
              }
              {showFinishButton(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'CheckMark', style: iconStyle }}
                    onClick={this.onfinishItemThunk.bind(this, item)}
                />
              }
              {showTaskButton(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'MyMoviesTV', style: iconStyle }}
                    onClick={this.onClickAddTaskButton.bind(this, item)}
                />
              }
              <div>
                <CommandButton
                    style={{marginTop: 8, fontSize: 18}}
                    iconProps={{ iconName: 'Add', style: {fontSize: 14, color: '#222222', marginRight: -2}}}
                    text={item.likes.toString()}
                    disabled={board.locked}
                    onClick={this.onlikeItemThunk.bind(this, item)}
                />
              </div>
            </div>
          </div>
          {showAddTask(item) && <Task />}
          {board.locked && activeItem && item.id === activeItem.id && item.stage === 'active' &&
            <Overlay className={classes.progress}>
              <ProgressIndicator percentComplete={1 - activeItemProgress} barHeight={6} />
            </Overlay>
          }
        </DocumentCard>
        {showTaskMap[item.id] && item.tasks.map(task => (
          <DocumentCard key={task.id} className={classes.taskCard}>
            <Text variant="medium">{task.title}</Text>
            <Persona text={task.owner.initials} hidePersonaDetails size={PersonaSize.size24} />
          </DocumentCard>
        ))}
      </div>
    ));
  }
}

const mapStateToProps = (state:ApplicationState) => ({
  board: state.board.board,
  group: state.group.group,
  activeItem: state.local.activeItem,
  activeItemProgress: state.local.activeItemProgress,
  hoveredItem: state.local.hoveredItem,
  showTaskMap: state.local.showTaskMap,
  addingTask: state.local.addingTask,
});
const mapDispatchToProps = { deleteItemThunk, setActiveItem, setHoverItem, likeItemThunk, finishItemThunk, startItemThunk, showTasks, hideTasks, showAddingTask, startActiveItemTimer, clearActiveItemTimer };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Pillar);
