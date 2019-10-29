import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import { Add, ClearRounded } from '@material-ui/icons';

import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DocumentCard } from 'office-ui-fabric-react';

import { setBoard } from '../actions/boardActions';
import { openSnackBar, closeSnackBar } from '../actions/localActions';
import { postItem } from '../actions/itemActions';
import { patchPillar, postPillar, deletePillar } from '../actions/pillarActions';


import Pillar from './Pillar';
import Utils from './Utils';

const classNames = mergeStyleSets({
  board: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  title: {
    marginBottom: 24,
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

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
  badge: {
    padding: 0,
  },
  header: {
    padding: theme.spacing.unit * 1,
  },
  length: {
    maxWidth: theme.spacing.unit * 999,
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
    this.state.progressTimer = setInterval(() => {
      const item = this.props.activeItem;
      if (item && item.end) {
        const difference = Math.floor((new Date(item.end).getTime() - new Date().getTime()) / 1000);
        if (difference > 0 && difference < this.state.secondsPerItem) {
          this.setState(state => ({
            ...state,
            itemProgress: Math.floor((state.secondsPerItem - difference) * 100 / state.secondsPerItem),
          }));
        } else {
          this.setState({ itemProgress: 100 });
        }
      }
    }, 1000);
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
    const { classes, board } = this.props;
    const { newItemInPillar, itemProgress } = this.state;

    const facilitator = board.facilitator;
    const pillars = board.pillars;
    const enabled = (board.stage !== 'archived' && !board.locked);

    const action = (pillar) => (enabled ?
      <IconButton
        disableRipple
        color="primary"
        className={classes.badge}
        onClick={this.handleDeletePillar.bind(this, pillar)}
      >
        <ClearRounded fontSize="small" />
      </IconButton>
      : null
    );

    return (
      <div className={classNames.board}>
        {facilitator && pillars && pillars.map(pillar => (
          <div key={pillar.id} className={classNames.pillar}>
            <DocumentCard className={classNames.card}>
              <div className={classNames.title}>
                <TextField
                    borderless
                    inputClassName={classNames.titleText}
                    disabled={!enabled}
                    defaultValue={pillar.title}
                    onChange={this.handleChangePillarTitle.bind(this, pillar)}
                    onKeyPress={this.handleSetPillarTitle.bind(this, pillar)}
                />
              </div>
              <div className={classNames.input}>
                <TextField
                    underlined
                    label="New:"
                    value={newItemInPillar[pillar.id]}
                    disabled={!enabled}
                    name={pillar.id}
                    onChange={this.handleChangeNewItemTitle.bind(this, pillar.id)}
                    onKeyPress={this.handleAddItem.bind(this, pillar.id)}
                />
              </div>
              <Pillar pillar={pillar} itemProgress={itemProgress} />
            </DocumentCard>
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
  withStyles(styles, { withTheme: true }),
)(Board);
