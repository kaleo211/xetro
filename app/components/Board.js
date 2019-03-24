import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Fab from '@material-ui/core/Fab';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Add } from '@material-ui/icons';

import { setBoard } from '../actions/boardActions';
import { openSnackBar, closeSnackBar } from '../actions/localActions';
import { postItem } from '../actions/itemActions';
import { patchPillar, postPillar } from '../actions/pillarActions';

import Items from './Items';

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
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newItemInPillar: [],
      titleOfPillar: [],
    };
  }

  changePillarTitle(id, title) {
    this.setState(state => {
      state.titleOfPillar[id] = title;
      return state;
    });
  }

  componentDidMount() {
    let board = this.props.board;
    board && board.pillars && board.pillars.map(pillar => {
      this.changePillarTitle(pillar.id, pillar.title);
    });
  }

  handleNewItemSave(pillarId, event) {
    let newItemInPillar = this.state.newItemInPillar;
    if (event && event.key === 'Enter' && newItemInPillar[pillarId] !== '') {
      let newItem = {
        title: newItemInPillar[pillarId].capitalize(),
        pillarId: pillarId,
      };

      this.props.postItem(newItem, this.props.board.id);
      newItemInPillar[pillarId] = '';
      this.setState({ newItemInPillar });
    }
  }

  handleChangeNewItem(e) {
    let newItemInPillar = this.state.newItemInPillar;
    newItemInPillar[e.target.name] = e.target.value;
    this.setState({ newItemInPillar });
  }

  handleAddPillar() {
    let pillar = {
      title: 'ChangeTitle',
      boardId: this.props.board.id,
    }
    this.props.postPillar(pillar);
  }

  handleChangePillarTitle(pillar, evt) {
    this.changePillarTitle(pillar.id, evt.target.value);
  }

  handleSetPillarTitle(pillar, evt) {
    if (evt && evt.key === 'Enter') {
      if (evt.target.value != '') {
        pillar.title = evt.target.value;
        this.props.patchPillar(pillar);
      } else {
        this.changePillarTitle(pillar.id, pillar.title);
      }
    }
  }

  render() {
    const { classes, board } = this.props;
    const { newItemInPillar, titleOfPillar } = this.state;

    console.log('board in board:', board);

    const pillarTitle = (pillar) => {
      return (
        <TextField fullWidth
          defaultValue={pillar.title}
          // value={titleOfPillar[pillar.id]}
          InputProps={{ disableUnderline: true, }}
          inputProps={{ className: classes.title, }}
          onChange={this.handleChangePillarTitle.bind(this, pillar)}
          onKeyPress={this.handleSetPillarTitle.bind(this, pillar)} >
        </TextField >
      )
    }

    board && board.pillars && board.pillars.sort((a, b) => {
      return a.id > b.id;
    });

    return (board && <div>
      <Grid container spacing={8}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
      >
        {board.facilitator && board.pillars && board.pillars.map((pillar) => (
          <Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card wrap='nowrap'>
              <CardHeader
                title={pillarTitle(pillar)}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null}
              />
              {/* <CardContent>
                <TextField fullWidth
                  label={pillar.intro}
                  disabled={board && board.locked}
                  name={pillar.id}
                  value={newItemInPillar[pillar.id]}
                  onChange={this.handleChangeNewItem.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar.id)}
                />
              </CardContent> */}
              <Items pillar={pillar} />
            </Card>
          </Grid>))}
      </Grid>

      <Fab className={classes.fab} onClick={this.handleAddPillar.bind(this)} >
        <Add />
      </Fab>
    </div>);
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  activeMember: state.boards.activeMember,
  groups: state.groups.groups,
  group: state.groups.group,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setBoard: (id) => dispatch(setBoard(id)),
    postItem: (item, bID) => dispatch(postItem(item, bID)),
    patchPillar: (p, pillar, bID) => dispatch(patchPillar(p, pillar, bID)),
    postPillar: (pillar, bID) => dispatch(postPillar(pillar, bID)),
    openSnackBar: (msg) => dispatch(openSnackBar(msg)),
    closeSnackBar: () => dispatch(closeSnackBar()),
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true })
)(Board);
