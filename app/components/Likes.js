import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import StarBorderRounded from '@material-ui/icons/StarBorderRounded';
import StarHalfRounded from '@material-ui/icons/StarHalfRounded';
import StarRounded from '@material-ui/icons/StarRounded';

const styles = theme => ({
  likes: {
    paddingTop: 6,
    fontSize: 18,
    marginLeft: -20,
    marginRight: 2,
  },
});

class Likes extends React.Component {
  render() {
    const { item, classes } = this.props;
    return (
      <div>
        {item.likes > 0 && item.likes <= 2 && (<StarBorderRounded className={classes.likes} />)}
        {item.likes > 2 && item.likes <= 4 && (<StarHalfRounded className={classes.likes} />)}
        {item.likes > 4 && (<StarRounded className={classes.likes} />)}
      </div>
    );
  }
}

Likes.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Likes);
