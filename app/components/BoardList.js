import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

import Select from 'react-select';
import NoSsr from '@material-ui/core/NoSsr';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { setBoard, listBoards } from '../actions/boardActions';
import { Paper, MenuItem } from '@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
    paddingTop: 60,
    paddingLeft: 50,
    paddingRight: 50,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  input: {
    color: "white",
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  console.log('controlerrr:', props.selectProps.classes.input.color)
  return (
    <TextField fullWidth
      InputProps={{
        inputComponent,
        disableUnderline: true,
        inputProps: {
          styles: { color: 'white' },
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      disabled={props.data.disabled}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      Group to Create/Join
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function DropdownIndicator(props) {
  return null;
}

function IndicatorSeparator(props) {
  return null;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  DropdownIndicator,
  IndicatorSeparator,
};

class BoardList extends React.Component {
  constructor(props) {
    super(props);

    this.handleSelectBoard = this.handleSelectBoard.bind(this);
  }

  componentDidMount() {
    this.props.listBoards(this.props.group.id);
  }

  handleSelectBoard(board) {
    console.log('handleSelectBoard:', board);
    this.props.setBoard(board.value);
  }

  render() {
    const { historyBoards, classes, theme } = this.props;

    let board = {
      value: this.props.board.id,
      label: this.props.board.name,
    }

    let boardNames = [];
    historyBoards.map(board => {
      boardNames.push({
        value: board.id,
        label: board.name,
      });
    });

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.white,
      }),
    };

    return (
      <NoSsr>
        <Select
          classes={classes}
          components={components}
          styles={selectStyles}
          value={board}
          options={boardNames}
          onChange={this.handleSelectBoard}
        />
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  historyBoards: state.boards.historyBoards,
  board: state.boards.board,
  group: state.groups.group,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setBoard: (id) => dispatch(setBoard(id)),
    listBoards: (id) => dispatch(listBoards(id)),
  };
}

BoardList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(BoardList);
