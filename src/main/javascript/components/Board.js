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
    padding: theme.spacing.unit * 3,
    minWidth: 0,
  },
  toolbar: theme.mixins.toolbar,
});

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boards: null,
      currentBoard: "null",
    };
  }

  componentWillMount() {
    fetch('http://localhost:8080/api/board')
      .then(resp => resp.json())
      .then(data => {
        let boards = data._embedded.board;
        this.setState({ boards: boards });

        if (boards.length > 0) {
          let currentBoard = boards[0];
          this.setState({ currentBoard: currentBoard });
        }
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
          <Members />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Pillars board={this.state.currentBoard} />
        </main>
      </div>
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Board);
