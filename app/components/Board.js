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

import Items from './Items';
import Utils from './Utils';
import { setBoard } from '../actions/boardActions';
import { openSnackBar, closeSnackBar } from '../actions/localActions';
import { postItem } from '../actions/itemActions';
import { patchPillar, postPillar } from '../actions/pillarActions';

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
      newItems: {},
    };
  }

  componentDidMount() {
    let board = this.props.board;
    board && board.pillars && board.pillars.map(pillar => {
      this.setState({
        ["pillarTitle" + pillar.id]: pillar.title,
      });
    });
  }

  handleNewItemSave(pillarID, event) {
    let newItems = this.state.newItems;
    if (event && event.key === 'Enter' && newItems[pillarID] !== "") {
      if (this.props.activeMember) {
        let newItem = {
          title: newItems[pillarID].capitalize(),
          pillar: Utils.prepend("pillars/" + pillarID),
          owner: Utils.prepend("members/" + this.props.activeMember.id),
        };

        this.props.postItem(newItem, this.props.board.id);
        newItems[pillarID] = "";
        this.setState({ newItems });
      } else {
        this.props.openSnackBar("please select item owner");
      }
    }
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState({ newItems });
  }

  handlePillarAdd() {
    let pillar = {
      title: "ChangeTitle",
      board: Utils.prepend("boards/" + this.props.board.id),
    }
    this.props.postPillar(pillar, this.props.board.id);
  }

  handlePillarTitleChange(pillar, evt) {
    this.setState({
      ["pillarTitle" + pillar.id]: evt.target.value,
    });
  }

  handlePillarTitleSubmit(pillar, evt) {
    if (evt && evt.key === 'Enter') {
      if (evt.target.value != "") {
        this.props.patchPillar("pillars/" + pillar.id, { title: evt.target.value }, this.props.board.id);
      } else {
        this.setState({
          ["pillarTitle" + pillar.id]: pillar.title,
        });
      }
    }
  }

  render() {
    const { classes, board } = this.props;
    const { newItems } = this.state;

    const pillarTitle = (pillar) => {
      return (
        <TextField fullWidth
          defaultValue={pillar.title}
          value={this.state["pillarTitle" + pillar.id]}
          InputProps={{ disableUnderline: true, }}
          inputProps={{ className: classes.title, }}
          onChange={this.handlePillarTitleChange.bind(this, pillar)}
          onKeyPress={this.handlePillarTitleSubmit.bind(this, pillar)} >
        </TextField >)
    }

    board && board.pillars && board.pillars.sort((a, b) => {
      return a.id > b.id;
    });

    return (board && <div>
      <Grid container spacing={8}
        direction="row"
        justify="flex-start"
        alignItems="stretch">
        {board.facilitator && board.pillars && board.pillars.map((pillar) => (
          <Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card wrap='nowrap'>
              <CardHeader
                title={pillarTitle(pillar)}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null} />
              <CardContent>
                <TextField fullWidth
                  label={pillar.intro}
                  disabled={board && board.locked}
                  name={pillar.id}
                  value={newItems[pillar.id]}
                  onChange={this.handleNewItemChange.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar.id)} />
              </CardContent>
              <Items pillar={pillar} />
            </Card>
          </Grid>))}
      </Grid>
      {!board.locked && (!board.pillars || board.pillars.length < 3) &&
        <Fab className={classes.fab} onClick={this.handlePillarAdd.bind(this)} >
          <Add />
        </Fab>}
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
  withStyles(styles)
)(Board);
