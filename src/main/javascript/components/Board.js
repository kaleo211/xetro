import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Members from './Members';
import Pillars from './Pillars';

const drawerWidth = 75;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  pillar: {
    height: '100%',
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 1,
    minWidth: 0,
  },
  toolbar: theme.mixins.toolbar,
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: null,
      selectedBoard: null,
      pillars: [],
      members: [],
    };

    this.updatePillars = this.updatePillars.bind(this);
  }

  updatePillars() {
    fetch(this.state.selectedBoard.pillarsLink)
      .then(resp => resp.json())
      .then(data => {
        let pillars = data._embedded.pillars;
        this.setState({ pillars });
        console.log("updated pillars:", pillars);
      });
  }

  componentWillMount() {
    fetch('http://localhost:8080/api/boards')
      .then(resp => resp.json())
      .then(data => {
        let boards = data._embedded.boards;
        this.setState({ boards });

        console.log("udpate boards:", boards);
        if (boards.length > 0) {
          let selectedBoard = boards[0];
          selectedBoard.pillarsLink = selectedBoard._links.pillars.href.replace('{?projection}', '');

          fetch(selectedBoard.pillarsLink)
            .then(resp => {
              if (resp.ok) {
                return resp.json();
              } else {
                console.log("failed to fetch pillars")
              }
            }).then(data => {
              console.log("initialized pillars:", data);
              let pillars = data._embedded.pillars;
              this.setState({ selectedBoard, pillars });
            });
        }
      });

    fetch("http://localhost:8080/api/member")
      .then(resp => resp.json())
      .then(data => {
        this.setState({ members: data._embedded.member })
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root} >
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Retro Board
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" classes={{ paper: classes.drawerPaper, }}>
          <div className={classes.toolbar} />
          <Members members={this.state.members} />
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Pillars pillars={this.state.pillars} updatePillars={this.updatePillars} members={this.state.members} />
        </main>
      </div>
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Board);
