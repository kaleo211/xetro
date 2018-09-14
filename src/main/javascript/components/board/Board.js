import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import {
  fetchTeamActiveBoards,
  selectBoard
} from '../../actions/boardActions';
import { connect } from 'react-redux';

import { Add } from '@material-ui/icons';

import Items from '../Items';
import Utils from '../Utils';
import { openSnackBar, closeSnackBar } from '../../actions/localActions';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 3,
  },
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newItems: {},
      newPillar: null,
    };

    this.updatePillars = this.updatePillars.bind(this);
  }

  handleNewItemSave(pillarID, event) {
    let newItems = this.state.newItems;
    if (event && event.key === 'Enter' && newItems[pillarID] !== "") {
      console.log("#Board# newItems with pillarID");

      if (this.props.selectedMember) {
        let newItem = {
          title: newItems[pillarID].capitalize(),
          pillar: Utils.appendLink("pillars/" + pillarID),
          owner: Utils.appendLink("members/" + this.props.selectedMember.id),
        };

        Utils.postResource("items", newItem, (() => {
          this.updatePillars();
          newItems[pillarID] = "";
          this.setState({ newItems });
        }));
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

  handleNewPillarClick() {
    this.setState({
      newPillar: {
        board: this.props.board._links.self.href,
      },
    });
  }

  handleNewPillarTitleChange(evt) {
    let newPillar = this.state.newPillar;
    newPillar.title = evt.target.value;
    this.setState({ newPillar });
  }

  handleNewPillarAdd(evt) {
    if (evt && evt.key === 'Enter' && this.state.newPillar.title != "") {
      Utils.postPillar(this.state.newPillar, (body => {
        console.log("#Board# posted new pillar:", body);
        this.setState({ newPillar: null });
        this.updatePillars();
      }));
    }
  }

  updatePillars() {
    this.props.selectBoard(this.props.board.id);
  }

  render() {
    const { classes, board } = this.props;
    const { newItems, newPillar } = this.state;
    return (board && <div>
      <Grid
        container
        spacing={8}
        direction="row"
        justify="flex-start"
        alignItems="stretch"
      >
        {board.facilitator && board.pillars && board.pillars.map((pillar) => (
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
              <Items pillar={pillar} />
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={12} md={4} >
          {newPillar && (
            <Card wrap='nowrap'>
              <CardContent>
                <TextField
                  autoFocus
                  fullWidth
                  label="New title"
                  value={newPillar.title}
                  onChange={this.handleNewPillarTitleChange.bind(this)}
                  onKeyPress={this.handleNewPillarAdd.bind(this)}
                />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {newPillar === null && !board.locked && (!board.pillars || board.pillars.length < 3) &&
        <Button mini variant="fab" className={classes.fab} onClick={this.handleNewPillarClick.bind(this)} >
          <Add />
        </Button>}
    </div>);
  }
}

const mapStateToProps = state => ({
  board: state.boards.board,
  selectedMember: state.boards.selectedMember,
  teams: state.teams.teams,
  team: state.teams.team,
});

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(mapStateToProps, {
  fetchTeamActiveBoards,
  selectBoard,
  openSnackBar,
  closeSnackBar,
})(withStyles(styles)(Board));
