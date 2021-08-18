import React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { DocumentCard, DocumentCardTitle, IconButton, ProgressIndicator, Persona, PersonaSize, Text, Overlay, CommandButton } from '@fluentui/react';
import { Depths } from '@fluentui/theme/lib/effects/FluentDepths';

import { setActiveItem, showActions, hideActions, showAddingAction, setHoverItem, startActiveItemTimer, clearActiveItemTimer } from '../store/local/action';
import { deleteItem, likeItem, finishItem, startItem } from '../store/item/action';
import Action from './Action';
import { BoardI, ItemI, PillarI } from '../../types/models';
import { ApplicationState } from '../store/types';
import { keyable } from '../../utils/tool';

const iconStyle = {
  fontSize: 18,
  color: '#222222',
};

const classes = mergeStyleSets({
  card: {
    maxWidth: '33vw',
    minWidth: 320,
    marginTop: 4,
  },
  hovered: {
    boxShadow: Depths.depth8,
  },
  actionCard: {
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
  actions: {
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
  activeItem: ItemI;
  pillar: PillarI;
  activeItemProgress: number,
  hoveredItem: ItemI,
  board: BoardI
  showActionMap: keyable
  addingAction: boolean

  deleteItem(item: ItemI): Promise<void>;
  finishItem(item: ItemI): Promise<void>;
  startItem(item: ItemI): Promise<void>;
  startActiveItemTimer(): void;
  clearActiveItemTimer(): void;
  setActiveItem(Item: ItemI): void;
  likeItem(item: ItemI): Promise<void>;
  showAddingAction(): void;
  hideActions(id: string): void;
  showActions(id: string): void;
  setHoverItem(item: ItemI): void;
}

interface StateI {}

class Pillar extends React.Component<PropsI, StateI> {
  constructor(props:any) {
    super(props);
    this.state = {};
  }

  onDeleteItem(item:ItemI) {
    this.props.deleteItem(item);
  }

  async onStartItem(item:ItemI, evt:React.MouseEvent) {
    evt.stopPropagation();
    const { activeItem } = this.props;
    if (activeItem != null) {
      await this.props.finishItem(activeItem);
    }
    await this.props.startItem(item);

    this.props.startActiveItemTimer();
  }

  onLikeItem(item:ItemI, evt:React.MouseEvent) {
    evt.stopPropagation();
    this.props.likeItem(item);
  }

  async onFinishItem(item:ItemI) {
    await this.props.clearActiveItemTimer();
    await this.props.finishItem(item);
  }

  async onClickAddActionButton(item:ItemI) {
    this.props.setActiveItem(item);
    this.props.showAddingAction();
  }

  onHideActions(item:ItemI) {
    this.props.hideActions(item.id);
  }

  onShowActions(item:ItemI) {
    this.props.showActions(item.id);
  }

  onHoverItem(item:ItemI) {
    this.props.setHoverItem(item);
  }

  onLeaveHoveredItem() {
    this.props.setHoverItem(null);
  }

  render() {
    const { activeItem, activeItemProgress, hoveredItem, pillar, board, showActionMap, addingAction } = this.props;
    const items = pillar.items;

    const showTimer = (item:ItemI) => {
      return board.locked && board.stage === 'created' && item.stage === 'created';
    };
    const showFinishButton = (item:ItemI) => {
      return board.locked && board.stage === 'created' && item.stage === 'active';
    };
    const showActionButton = (item:ItemI) => {
      return board.locked && board.stage === 'created' && item.stage !== 'created';
    };
    const showAddAction = (item:ItemI) => {
      return board.locked && board.stage === 'created' && addingAction;
    };
    const showFoldButton = (item:ItemI) => {
      return item.actions.length > 0;
    };

    return items.map(item => (
      <div key={item.id}>
        <DocumentCard
            key={item.id}
            // className={cx({card: true, hovered: hoveredItem.id===item.id})}
            onMouseOver={this.onHoverItem.bind(this, item)}
            onFocus={() => {}}
            onMouseLeave={this.onLeaveHoveredItem.bind(this)}
        >
          {!board.locked && hoveredItem.id===item.id &&
            <IconButton
                primary
                className={classes.deleteButton}
                iconProps={{ iconName: 'Cancel', style: {fontSize: 12, color: 'red'} }}
                onClick={this.onDeleteItem.bind(this, item)}
            />
          }
          <div className={classes.title}>
            <DocumentCardTitle
                title={item.title}
                className={item.stage !== 'done' ? classes.titleText : classes.titleTextDone}
            />
            <div className={classes.actions}>
              {showFoldButton(item) && (
                typeof showActionMap[item.id] === 'undefined' || !showActionMap[item.id] ?
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'ChevronUp', style: iconStyle }}
                      onClick={this.onShowActions.bind(this, item)}
                  /> :
                  <IconButton
                      primary
                      className={classes.iconButton}
                      iconProps={{ iconName: 'ChevronDown', style: iconStyle }}
                      onClick={this.onHideActions.bind(this, item)}
                  />
              )}
              {showTimer(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'Stopwatch', style: iconStyle }}
                    onClick={this.onStartItem.bind(this, item)}
                />
              }
              {showFinishButton(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'CheckMark', style: iconStyle }}
                    onClick={this.onFinishItem.bind(this, item)}
                />
              }
              {showActionButton(item) &&
                <IconButton
                    primary
                    className={classes.iconButton}
                    iconProps={{ iconName: 'MyMoviesTV', style: iconStyle }}
                    onClick={this.onClickAddActionButton.bind(this, item)}
                />
              }
              <div>
                <CommandButton
                    style={{marginTop: 8, fontSize: 18}}
                    iconProps={{ iconName: 'Add', style: {fontSize: 14, color: '#222222', marginRight: -2}}}
                    text={item.likes.toString()}
                    disabled={board.locked}
                    onClick={this.onLikeItem.bind(this, item)}
                />
              </div>
            </div>
          </div>
          {showAddAction(item) && <Action />}
          {board.locked && item.id === activeItem.id && item.stage === 'active' &&
            <Overlay className={classes.progress}>
              <ProgressIndicator percentComplete={1 - activeItemProgress} barHeight={6} />
            </Overlay>
          }
        </DocumentCard>
        {showActionMap[item.id] && item.actions.map(action => (
          <DocumentCard key={action.id} className={classes.actionCard}>
            <Text variant="medium">{action.title}</Text>
            <Persona text={action.owner.initials} hidePersonaDetails size={PersonaSize.size24} />
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
  showActionMap: state.local.showActionMap,
  addingAction: state.local.addingAction,
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
  deleteItem: (item:ItemI) => dispatch(deleteItem(item)),
  setActiveItem: (item:ItemI) => dispatch(setActiveItem(item)),
  setHoverItem: (item:ItemI) => dispatch(setHoverItem(item)),
  likeItem: (item:ItemI) => dispatch(likeItem(item)),
  finishItem: (item:ItemI) => dispatch(finishItem(item)),
  startItem: (item:ItemI) => dispatch(startItem(item)),
  showActions: (id:string) => dispatch(showActions(id)),
  hideActions: (id:string) => dispatch(hideActions(id)),
  showAddingAction: () => dispatch(showAddingAction()),
  startActiveItemTimer: () => dispatch(startActiveItemTimer()),
  clearActiveItemTimer: () => dispatch(clearActiveItemTimer()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Pillar);
