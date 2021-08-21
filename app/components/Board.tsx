import * as React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { DocumentCard, Text, TextField, Modal, Image } from '@fluentui/react';

import { postItem } from '../store/item/action';
import { patchPillar, postPillar, deletePillar } from '../store/pillar/action';
import { setELMO } from '../store/local/action';
import Pillar from './Pillar';
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
  board: BoardI
  group: GroupI
  elmo: boolean

  postPillar(pillar: PillarI): Promise<void>
  patchPillar(pillar: PillarI): Promise<void>
  postItem(item:ItemI): Promise<void>
  setELMO(val: boolean): void
  deletePillar(pillar: PillarI): Promise<void>
}

interface StateI {
  newItemTnPillar: Keyable,
  titleOfPillar: Keyable,
}

class Board extends React.Component<PropsI, StateI> {
  constructor(props:any) {
    super(props);

    this.state = {
      newItemTnPillar: {},
      titleOfPillar: {},
    };
  }

  componentWillMount() {
    this.initTitleOfPillar(this.props.board);
  }

  componentWillReceiveProps(props: PropsI) {
    this.initTitleOfPillar(props.board);
  }

  initTitleOfPillar(board: BoardI) {
    const titleOfPillar:Keyable = {};
    board.pillars.map(pillar => {
      titleOfPillar[pillar.id] = pillar.title;
    });
    this.setState({titleOfPillar});
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

  onAddItem(pillarID: string, event: React.KeyboardEvent<HTMLInputElement>) {
    const newItemTitle = this.state.newItemTnPillar[pillarID];
    if (event && event.key === 'Enter' && newItemTitle !== '') {
      const newItem:ItemI = {
        pillarID,
        title: newItemTitle,
        boardID: this.props.board.id,
        groupID: this.props.group.id,
      };
      this.props.postItem(newItem);
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

  onSetPillarTitle(pillar:PillarI, evt:React.KeyboardEvent<HTMLInputElement>) {
    if (evt) {
      if (evt.key === 'Enter') {
        if (this.state.titleOfPillar[pillar.id] !== '') {
          this.props.patchPillar(pillar);
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

    const pillars = board.pillars;
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
                      value={newItemTnPillar[pillar.id]}
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

const mapDispatchToProps = {
  deletePillar,
  patchPillar,
  postItem,
  postPillar,
  setELMO,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Board);
