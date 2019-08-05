import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Fab from '@material-ui/core/Fab';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Add, ClearRounded } from '@material-ui/icons';

import { setBoard } from '../actions/boardActions';
import { openSnackBar, closeSnackBar } from '../actions/localActions';
import { postItem } from '../actions/itemActions';
import { patchPillar, postPillar, deletePillar } from '../actions/pillarActions';

import Pillar from './Pillar';
import Utils from './Utils';

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

  handleAddItem(pillarId, event) {
    const newItemTitle = this.state.newItemInPillar[pillarId];
    if (event && event.key === 'Enter' && newItemTitle !== '') {
      const newItem = {
        pillarId,
        title: newItemTitle,
        boardId: this.props.board.id,
        groupId: this.props.group.id,
      };
      this.props.postItem(newItem);
      this.changeItemTitle(pillarId, '');
    }
  }

  handleChangeNewItemTitle(pillarId, evt) {
    this.changeItemTitle(pillarId, evt.target.value);
  }

  handleAddPillar() {
    const pillar = {
      title: 'ChangeTitle',
      boardId: this.props.board.id,
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
    const pillars = board.pillars.sort(Utils.createdAt());
    const enabled = (board.stage !== 'archived' && !board.locked);

    const pillarTitle = (pillar) => (
      <TextField
        fullWidth
        disabled={!enabled}
        defaultValue={pillar.title}
        InputProps={{ disableUnderline: true }}
        inputProps={{ className: classes.title }}
        onChange={this.handleChangePillarTitle.bind(this, pillar)}
        onKeyPress={this.handleSetPillarTitle.bind(this, pillar)}
      />
    );

    const size = () => (board.pillars.length <= 3 ? 4 : 3);

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
      <div>
        <Grid
          container
          spacing={8}
          direction="row"
          justify="flex-start"
          alignItems="stretch"
        >
          {facilitator && pillars && pillars.map(pillar => (
            <Grid item key={pillar.title} xs={12} sm={12} md={size()}>
              <Card wrap="nowrap">
                <CardHeader
                  title={pillarTitle(pillar)}
                  subheader={pillar.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={action(pillar)}
                />
                <CardContent>
                  {board.stage !== 'archived' && !board.locked &&
                    <TextField
                      fullWidth
                      label={pillar.intro}
                      value={newItemInPillar[pillar.id]}
                      disabled={!enabled}
                      name={pillar.id}
                      onChange={this.handleChangeNewItemTitle.bind(this, pillar.id)}
                      onKeyPress={this.handleAddItem.bind(this, pillar.id)}
                    />
                  }
                </CardContent>
                <Pillar pillar={pillar} itemProgress={itemProgress} />
              </Card>
            </Grid>))}
        </Grid>

        <Fab className={classes.fab} onClick={this.handleAddPillar.bind(this)}>
          <Add />
        </Fab>
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

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(Board);
