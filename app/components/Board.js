import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { DocumentCard, Text, TextField, Modal, Image } from 'office-ui-fabric-react';

import { setBoard } from '../actions/boardActions';
import { postItem } from '../actions/itemActions';
import { patchPillar, postPillar, deletePillar } from '../actions/pillarActions';
import { setELMO } from '../actions/localActions';
import Pillar from './Pillar';
import elmoGif from '../public/elmo.gif';

const classNames = mergeStyleSets({
  board: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  title: {
    marginBottom: 16,
    marginTop: 8,
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
      titleOfPillar: {},
      progressTimer: null,
      itemProgress: 0,
    };
  }

  componentWillMount() {
    this.initTitleOfPillar(this.props.board);
  }

  componentWillReceiveProps(props) {
    this.initTitleOfPillar(props.board);
  }

  initTitleOfPillar(board) {
    const titleOfPillar = {};
    board.pillars.map(pillar => {
      titleOfPillar[pillar.id] = pillar.title;
    });
    console.log('titleofPillar', titleOfPillar);
    this.setState({titleOfPillar});
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

  onAddItem(pillarID, event) {
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

  onChangeNewItemTitle(pillarID, evt) {
    this.changeItemTitle(pillarID, evt.target.value);
  }

  onAddPillar() {
    const pillar = {
      title: 'ChangeTitle',
      boardID: this.props.board.id,
    };
    this.props.postPillar(pillar);
  }

  onDeletePillar(pillar) {
    this.props.deletePillar(pillar);
  }

  onChangePillarTitle(pillar, evt) {
    this.changePillarTitle(pillar.id, evt.target.value);
  }

  onSetPillarTitle(pillar, evt) {
    if (evt && evt.key === 'Enter') {
      if (evt.target.value !== '') {
        this.props.patchPillar({ ...pillar, title: evt.target.value });
      } else {
        this.changePillarTitle(pillar.id, pillar.title);
      }
    }
  }

  onResetPillarTitle(pillar) {
    this.changePillarTitle(pillar.id, pillar.title);
  }

  onClickELMO() {
    this.props.setELMO(false);
  }

  render() {
    const { board, elmo } = this.props;
    const { newItemInPillar, itemProgress, titleOfPillar } = this.state;

    const pillars = board.pillars;
    console.log('board', board);
    const enabled = (board.stage !== 'archived' && !board.locked);

    return (
      <div className={classNames.board}>
        {pillars && pillars.map(pillar => (
          <div key={pillar.id} className={classNames.pillar}>
            <DocumentCard className={classNames.card}>
              {enabled &&
                <div className={classNames.title}>
                  <TextField
                      borderless
                      inputClassName={classNames.titleText}
                      value={titleOfPillar[pillar.id]}
                      
                      onChange={this.onChangePillarTitle.bind(this, pillar)}
                      onKeyPress={this.onSetPillarTitle.bind(this, pillar)}
                      onBlur={this.onResetPillarTitle.bind(this, pillar)}
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
                      onChange={this.onChangeNewItemTitle.bind(this, pillar.id)}
                      onKeyPress={this.onAddItem.bind(this, pillar.id)}
                  />
                </div>
              }
              {!enabled &&
                <div className={classNames.lockedTitle}>
                  <Text variant="xxLarge">
                    {pillar.title}
                  </Text>
                </div>
              }
            </DocumentCard>
            <Pillar pillar={pillar} itemProgress={itemProgress} />
          </div>
        ))}
        <Modal isOpen={elmo} isBlocking={true}>
          <Image src={elmoGif} onClick={this.onClickELMO.bind(this)} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeItem: state.local.activeItem,
  elmo: state.local.elmo,
  board: state.boards.board,
  group: state.groups.group,
});

const mapDispatchToProps = (dispatch) => ({
  deletePillar: (pillar) => dispatch(deletePillar(pillar)),
  patchPillar: (p, pillar, bID) => dispatch(patchPillar(p, pillar, bID)),
  postItem: (item, bID) => dispatch(postItem(item, bID)),
  postPillar: (pillar, bID) => dispatch(postPillar(pillar, bID)),
  setBoard: (id) => dispatch(setBoard(id)),
  setELMO: (on) => dispatch(setELMO(on)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Board);
