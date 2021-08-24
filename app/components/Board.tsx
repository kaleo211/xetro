import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { DocumentCard, Text, TextField, Modal, Image } from '@fluentui/react';

import { postItemThunk } from '../store/item/action';
import { patchPillar, postPillar, deletePillar } from '../store/pillar/action';
import { setELMO } from '../store/local/action';
import Pillar from './Item';
import elmoGif from '../public/elmo.gif';
import { Keyable } from '../../types/common';
import { BoardI, GroupI, ItemI, PillarI } from '../../types/models';
import { ApplicationState } from '../store/types';

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

interface PropsI {
  elmo: boolean

  board: BoardI
  group: GroupI

  deletePillar(pillar: PillarI): Promise<void>
  patchPillar(pillar: PillarI): Promise<void>
  postItemThunk(item:ItemI): Promise<void>
  postPillar(pillar: PillarI): Promise<void>
  setELMO(val: boolean): void
}

interface StateI {
  newItemTnPillar: Keyable,
  titleOfPillar: Keyable,
}

class Board extends React.Component<PropsI, StateI> {
  constructor(props: PropsI) {
    super(props);

    this.state = {
      newItemTnPillar: {},
      titleOfPillar: {},
    };
  }

  static getDerivedStateFromProps(props: PropsI, state: StateI) {
    const titleOfPillar:Keyable = {};
    props.board && props.board.pillars.map(pillar => {
      titleOfPillar[pillar.id] = pillar.title;
    });
    return { titleOfPillar };
  }

  changePillarTitle(id: string, title:string) {
    this.setState(state => {
      const newState = state;
      newState.titleOfPillar[id] = title;
      return newState;
    });
  }

  changeItemTitle(id:string, title:string) {
    this.setState((state:StateI) => {
      const newState = state;
      newState.newItemTnPillar[id] = title;
      return newState;
    });
  }

  onAddItem(pillarID: string, evt: React.KeyboardEvent<HTMLInputElement>) {
    const newItemTitle = this.state.newItemTnPillar[pillarID];

    if (evt && evt.key === 'Enter' && newItemTitle !== '') {
      const newItem:ItemI = {
        pillarID,
        title: newItemTitle,
        boardID: this.props.board.id,
        groupID: this.props.group.id,
      };
      this.props.postItemThunk(newItem);
      this.changeItemTitle(pillarID, '');
    }
  }

  onChangeNewItemTitle(pillarID: string, evt: React.ChangeEvent<HTMLInputElement>) {
    this.changeItemTitle(pillarID, evt.target.value);
  }

  onAddPillar() {
    const pillar: PillarI = {
      title: 'ChangeTitle',
      boardID: this.props.board.id,
    };
    this.props.postPillar(pillar);
  }

  onDeletePillar(pillar:PillarI) {
    this.props.deletePillar(pillar);
  }

  onChangePillarTitle(pillar:PillarI, evt:React.ChangeEvent<HTMLInputElement>) {
    this.changePillarTitle(pillar.id, evt.target.value);
  }

  async onSetPillarTitle(pillar:PillarI, evt:React.KeyboardEvent<HTMLInputElement>) {
    if (evt) {
      if (evt.key === 'Enter') {
        if (this.state.titleOfPillar[pillar.id] !== '') {
          await this.props.patchPillar(pillar);
        }
      } else {
        this.changePillarTitle(pillar.id, pillar.title);
      }
    }
  }

  onResetPillarTitle(pillar:PillarI) {
    this.changePillarTitle(pillar.id, pillar.title);
  }

  onClickELMO() {
    this.props.setELMO(false);
  }

  render() {
    const { board, elmo } = this.props;
    const { newItemTnPillar, titleOfPillar } = this.state;

    const enabled = (board: BoardI) => {
      return board.stage !== 'archived' && !board.locked;
    }

    return (board &&
      <div className={classNames.board}>
        {board.pillars && board.pillars.map(pillar => (
          <div key={pillar.id} className={classNames.pillar}>
            <DocumentCard className={classNames.card}>
              {enabled(board) &&
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
              {enabled(board) &&
                <div className={classNames.input}>
                  <TextField
                      underlined
                      label="New:"
                      value={newItemTnPillar[pillar.id]}
                      name={pillar.id}
                      onChange={this.onChangeNewItemTitle.bind(this, pillar.id)}
                      onKeyPress={this.onAddItem.bind(this, pillar.id)}
                  />
                </div>
              }
              {!enabled(board) &&
                <div className={classNames.lockedTitle}>
                  <Text variant="xxLarge">
                    {pillar.title}
                  </Text>
                </div>
              }
            </DocumentCard>
            <Pillar pillar={pillar} />
          </div>
        ))}
        <Modal isOpen={elmo} isBlocking={true}>
          <Image src={elmoGif} onClick={this.onClickELMO.bind(this)} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state:ApplicationState) => ({
  elmo: state.local.elmo,
  board: state.board.board,
  group: state.group.group,
});
const mapDispatchToProps = { deletePillar, patchPillar, postItemThunk, postPillar, setELMO };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Board);
