import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { CheckRounded } from '@material-ui/icons';

import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import { setGroup } from '../actions/groupActions';
import { setBoard } from '../actions/boardActions';
import { setPage } from '../actions/localActions';
import { finishItem } from '../actions/itemActions';

const styles = theme => ({
  nested: {
    marginLeft: theme.spacing.unit * 1,
  },
});

class ActionItemList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
    };
  }

  handleFinishAction(action) {
    this.props.finishItem(action);
  }

  render() {
    const { me, classes } = this.props;
    return (me &&
      <List disablePadding>
        {me.actions && me.actions.map(action =>
          <ListItem button key={action.id} className={classes.nested} >
            <ListItemText primary={action.title} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Delete" onClick={this.handleFinishAction.bind(this, action)}>
                <CheckRounded />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  group: state.groups.group,
  me: state.users.me,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setGroup: (id) => dispatch(setGroup(id)),
    setBoard: (id) => dispatch(setBoard(id)),
    setPage: (page) => dispatch(setPage(page)),
    finishItem: (item) => dispatch(finishItem(item)),
  };
};

ActionItemList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(ActionItemList);
