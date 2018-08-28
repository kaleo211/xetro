import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SignalCellular1BarRounded from '@material-ui/icons/SignalCellular1BarRounded';
import SignalCellular2BarRounded from '@material-ui/icons/SignalCellular2BarRounded';
import SignalCellular3BarRounded from '@material-ui/icons/SignalCellular3BarRounded';
import SignalCellular4BarRounded from '@material-ui/icons/SignalCellular4BarRounded';


const styles = theme => ({
  likes: {
    paddingTop: 4,
    paddingLeft: 10,
  }
});

class Likes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, classes } = this.props;

    return (
      <div>
        {item.likes > 0 && item.likes <= 2 && (
          <SignalCellular1BarRounded className={classes.likes} fontSize='inherit' />
        )}
        {item.likes > 2 && item.likes <= 4 && (
          <SignalCellular2BarRounded className={classes.likes} fontSize='inherit' />
        )}
        {item.likes > 4 && item.likes <= 6 && (
          <SignalCellular3BarRounded className={classes.likes} fontSize='inherit' />
        )}
        {item.likes > 6 && (
          <SignalCellular4BarRounded className={classes.likes} fontSize='inherit' />
        )}
      </div>
    );
  }
}

Likes.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Likes);
