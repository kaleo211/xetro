import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {
  LockOutlined,
  LockOpenOutlined,
  KeyboardRounded,
  VoiceChat,
  RefreshRounded,
} from '@material-ui/icons';

import Utils from '../Utils';


const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pillars: [],
      newItems: {},
    };
  }

  handleNewItemSave(pillarID, event) {
    let newItems = this.state.newItems;

    if (event && event.key === 'Enter' && newItems[pillarID] !== "") {
      // console.log("#Pillars# board in new item save:", this.props.board);

      let pillarLink = "";
      this.props.pillars.map(pillar => {
        if (pillar.id === pillarID) {
          pillarLink = pillar._links.self.href;
        }
      });

      let newItem = {
        title: newItems[pillarID].capitalize(),
        pillar: pillarLink,
        onwer: this.props.board._links.facilitator.href.replace('{?projection}', ''),
      };

      Utils.postResource("items", newItem, (() => {
        this.props.updatePillars();
        newItems[pillarID] = "";
        this.setState({ newItems });
      }));
    }
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState(newItems);
  }





  handleBoardLock() {
    let updatedBoard = { locked: true };
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      let board = body;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      this.setState({ board: Utils.reformBoard(board) });
    }));
    this.props.handleSnackbarOpen("Board is LOCKED.")
  }

  handleBoardUnlock() {
    let updatedBoard = { locked: false };
    Utils.patchResource(this.state.board, updatedBoard, (body => {
      let board = body;
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      this.setState({ board: Utils.reformBoard(board) });
    }));
    this.props.handleSnackbarOpen("Board is UNLOCKED.");
  }

  handleVideoOpen(url) {
    let win = window.open(url, '_blank');
    win.focus();
  }

  componentWillReceiveProps() {
    let board = this.props.board;
    if (board) {
      console.log("board in receive:", board);
      board.pillarsLink = board._links.pillars.href.replace('{?projection}', '');
      Utils.get(board.pillarsLink, (body => {
        console.log("updating pillars with board:", board);
        let pillars = body._embedded.pillars;
        this.setState({ board: Utils.reformBoard(board), pillars });
      }));
    }
  }

  render() {
    const { classes, board, teams, team, members } = this.props;
    const { pillars, selectedMember } = this.state;

    return (
      <Grid
        container
        spacing={8}
        direction="row"
        justify="space-between"
        alignItems="stretch"
      >
        {board && board.facilitator && pillars.map((pillar) => (
          <Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card wrap='nowrap'>
              <CardHeader
                title={pillar.title}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null}
              />
              <CardContent>
                <TextField
                  id="createNewItem"
                  fullWidth
                  key={"pillar" + pillar.id}
                  label={pillar.intro}
                  disabled={board && board.locked}
                  name={pillar.id}
                  value={newItems[pillar.id]}
                  onChange={this.handleNewItemChange.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar.id)}
                />
              </CardContent>

              <Items
                board={board}
                pillar={pillar}
                members={members}
                updatePillars={this.props.updatePillars}
              />
            </Card>
          </Grid>
        ))}
      </Grid >
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Board);
