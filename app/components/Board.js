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

import Pillar from './Pillar';

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

    let pillars = this.props.pillars;

    let newItemInPillar = [];
    let titleOfPillar = [];
    pillars && pillars.map(pillar => {
      newItemInPillar.push(pillar.id, '');
      titleOfPillar.push(pillar.id, pillar.title);
    });

    this.state = {
      newItemInPillar: newItemInPillar,
      titleOfPillar: titleOfPillar,
    };
  }

  changePillarTitle(id, title) {
    this.setState(state => {
      state.titleOfPillar[id] = title;
      return state;
    });
  }

  changeItemTitle(id, title) {
    this.setState(state => {
      state.newItemInPillar[id] = title;
      return state;
    });
  }

  handleAddItem(pillarId, event) {
    let newItemTitle = this.state.newItemInPillar[pillarId];
    if (event && event.key === 'Enter' && newItemTitle !== '') {
      let newItem = {
        title: newItemTitle,
        pillarId: pillarId,
        boardId: this.props.board.id,
      };
      this.props.postItem(newItem);
      this.changeItemTitle(pillarId, '');
    }
  }

  handleChangeNewItemTitle(pillarId, evt) {
    this.changeItemTitle(pillarId, evt.target.value);
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
    const { classes, board, pillars } = this.props;
    const { newItemInPillar } = this.state;

    const pillarTitle = (pillar) => {
      return (
        <TextField fullWidth
          defaultValue={pillar.title}
          InputProps={{ disableUnderline: true, }}
          inputProps={{ className: classes.title, }}
          onChange={this.handleChangePillarTitle.bind(this, pillar)}
          onKeyPress={this.handleSetPillarTitle.bind(this, pillar)} >
        </TextField >
      )
    }

    pillars && pillars.sort((a, b) => {
      return a.createdAt < b.createdAt;
    });

    return (board && <div>
      <Grid container spacing={8}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
      >
        {board.facilitator && pillars && pillars.map(pillar => (
          <Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card wrap='nowrap'>
              <CardHeader
                title={pillarTitle(pillar)}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null}
              />
              <CardContent>
                <TextField fullWidth
                  label={pillar.intro}
                  value={newItemInPillar[pillar.id]}
                  disabled={board && board.locked}
                  name={pillar.id}
                  onChange={this.handleChangeNewItemTitle.bind(this, pillar.id)}
                  onKeyPress={this.handleAddItem.bind(this, pillar.id)}
                />
              </CardContent>
              <Pillar pillar={pillar} />
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
  groups: state.groups.groups,
  group: state.groups.group,
  pillars: state.boards.pillars,
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
