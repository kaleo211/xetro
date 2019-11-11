import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { DocumentCard, Text, TextField } from 'office-ui-fabric-react';

import { setBoard } from '../actions/boardActions';
import { openSnackBar, closeSnackBar } from '../actions/localActions';
import { postItem } from '../actions/itemActions';
import { patchPillar, postPillar, deletePillar } from '../actions/pillarActions';
import Pillar from './Pillar';

const classNames = mergeStyleSets({
  board: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  title: {
    marginBottom: 24,
  },
  lockedTitle: {
    height: 89,
    fontSize: 56,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
  },
  input: {
  },
  pillar: {
    width: '33vw',
    marginRight: 8,
  },
  card: {
    maxWidth: '33vw',
    minWidth: 320,
  },
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newItemInPillar: [],
      titleOfPillar: [],
      progressTimer: null,
      itemProgress: 0,
      secondsPerItem: 300,
    };
  }

  componentDidMount() {
    // this.state.progressTimer = setInterval(() => {
    //   const item = this.props.activeItem;
    //   if (item && item.end) {
    //     const difference = (new Date(item.end).getTime() - new Date().getTime()) / 1000;
    //     if (difference > 0 && difference < this.state.secondsPerItem) {
    //       this.setState(state => ({
    //         ...state,
    //         itemProgress: (state.secondsPerItem - difference) / state.secondsPerItem,
    //       }));
    //     } else {
    //       this.setState({ itemProgress: 1 });
    //     }
    //   }
    // }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.state.progressTimer);
  }

  changePillarTitle(id, title) {
    this.setState(state => {
      const newState = state;
      newState.titleOfPillar[id] = title;
      return newState;
    });
  }

  changeItemTitle(id, title) {
    this.setState(state => {
      const newState = state;
      newState.newItemInPillar[id] = title;
      return newState;
    });
  }

  handleAddItem(pillarID, event) {
    const newItemTitle = this.state.newItemInPillar[pillarID];
    if (event && event.key === 'Enter' && newItemTitle !== '') {
      const newItem = {
        pillarID,
        title: newItemTitle,
        boardID: this.props.board.id,
        groupID: this.props.group.id,
      };
      this.props.postItem(newItem);
      this.changeItemTitle(pillarID, '');
    }
  }

  handleChangeNewItemTitle(pillarID, evt) {
    this.changeItemTitle(pillarID, evt.target.value);
  }

  handleAddPillar() {
    const pillar = {
      title: 'ChangeTitle',
      boardID: this.props.board.id,
    };
    this.props.postPillar(pillar);
  }

  handleDeletePillar(pillar) {
    this.props.deletePillar(pillar);
  }

  handleChangePillarTitle(pillar, evt) {
    this.changePillarTitle(pillar.id, evt.target.value);
  }

  handleSetPillarTitle(pillar, evt) {
    if (evt && evt.key === 'Enter') {
      if (evt.target.value !== '') {
        this.props.patchPillar({ ...pillar, title: evt.target.value });
      } else {
        this.changePillarTitle(pillar.id, pillar.title);
      }
    }
  }

  render() {
    const { board } = this.props;
    const { newItemInPillar, itemProgress } = this.state;

    const facilitator = board.facilitator;
    const pillars = board.pillars;
    const enabled = (board.stage !== 'archived' && !board.locked);

    return (
      <div className={classNames.board}>
        {facilitator && pillars && pillars.map(pillar => (
          <div key={pillar.id} className={classNames.pillar}>
            <DocumentCard className={classNames.card}>
              {enabled &&
                <div className={classNames.title}>
                  <TextField
                      borderless
                      inputClassName={classNames.titleText}
                      defaultValue={pillar.title}
                      onChange={this.handleChangePillarTitle.bind(this, pillar)}
                      onKeyPress={this.handleSetPillarTitle.bind(this, pillar)}
                  />
                </div>
              }
              {enabled &&
                <div className={classNames.input}>
                  <TextField
                      underlined
                      label="New:"
                      value={newItemInPillar[pillar.id]}
                      name={pillar.id}
                      onChange={this.handleChangeNewItemTitle.bind(this, pillar.id)}
                      onKeyPress={this.handleAddItem.bind(this, pillar.id)}
                  />
                </div>
              }
              {!enabled &&
                <div className={classNames.lockedTitle}>
                  <Text variant="superLarge">
                    {pillar.title}
                  </Text>
                </div>
              }
            </DocumentCard>
            <Pillar pillar={pillar} itemProgress={itemProgress} />
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  group: state.groups.group,
  activeItem: state.local.activeItem,
  draw: state.local.drawOpen,
});

const mapDispatchToProps = (dispatch) => ({
  setBoard: (id) => dispatch(setBoard(id)),
  postItem: (item, bID) => dispatch(postItem(item, bID)),
  patchPillar: (p, pillar, bID) => dispatch(patchPillar(p, pillar, bID)),
  postPillar: (pillar, bID) => dispatch(postPillar(pillar, bID)),
  openSnackBar: (msg) => dispatch(openSnackBar(msg)),
  closeSnackBar: () => dispatch(closeSnackBar()),
  deletePillar: (pillar) => dispatch(deletePillar(pillar)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Board);
