import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Divider from '@material-ui/core/Divider';
import Done from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlusOne from '@material-ui/icons/PlusOne';
import PropTypes from 'prop-types';
import Save from '@material-ui/icons/Save';
import Chat from '@material-ui/icons/Chat';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Storage from '@material-ui/icons/Storage';
import TextField from '@material-ui/core/TextField';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import SignalCellular1BarRounded from '@material-ui/icons/SignalCellular1BarRounded';
import SignalCellular2BarRounded from '@material-ui/icons/SignalCellular2BarRounded';
import SignalCellular3BarRounded from '@material-ui/icons/SignalCellular3BarRounded';
import SignalCellular4BarRounded from '@material-ui/icons/SignalCellular4BarRounded';

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 1,
  },
  item: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 1,
  },
  itemDone: {
    textDecoration: "line-through",
  },
});

class Pillars extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaveButtonDisabled: [],
      newItems: {},
      anchorEl: {},
      expandedItem: "",
    }
  }

  componentWillReceiveProps(props) {
    let pillars = props.pillars;
    let isSaveButtonDisabled = [];

    if (pillars) {
      let newItems = {};
      for (let idx = 0; idx < pillars.length; idx++) {
        let pillar = pillars[idx];
        let pillarHref = pillar._links.self.href
        newItems[pillarHref] = "";
        isSaveButtonDisabled[pillarHref] = true;
      }
      this.setState({ newItems, isSaveButtonDisabled });
    }
  }

  handleNewLikeSave(idx, item, event) {
    item.likes += 1;

    fetch(item._links.self.href, {
      method: 'put',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        this.handleCloseItemMenu(item, event);
      }
    })
  }

  handleItemDone(idx, item, event) {
    item.checked = true;
    fetch(item._links.self.href, {
      method: 'put',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        this.handleCloseItemMenu(item, event);
      } else {
        console.log("failed to update item resp:", resp);
      }
    })
  }

  handleNewItemSave(idx, pillar, event) {
    let newItem = {
      title: this.state.newItems[pillar],
      pillar: pillar,
    }

    fetch("http://localhost:8080/api/item", {
      method: 'post',
      body: JSON.stringify(newItem),
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        console.log("pillar save:", pillar);
        this.state.newItems[pillar] = "";
      } else {
        throw new Error('failed to post new item');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  handleItemDelete(idx, item, event) {
    fetch(item._links.self.href, {
      method: 'delete',
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillar(idx);
        this.handleCloseItemMenu(item, event);
      } else {
        console.log("failed to delete item resp:", resp);
      }
    });
  }

  handleDoubleClick() {
    alert("haha")
  }

  handleItemExpandToggle(item, event) {
    console.log("hahah")
    let expandedItem = this.state.expandedItem;
    if (expandedItem && expandedItem === item._links.self.href) {
      this.setState({
        expandedItem: "",
      })
    } else {
      this.setState({ expandedItem: item._links.self.href });
    }
  }

  handleNewItemChange(e) {
    let newItems = this.state.newItems;
    newItems[e.target.name] = e.target.value;
    this.setState(newItems);

    if (e.target.value === "") {
      this.state.isSaveButtonDisabled[e.target.name] = true
    } else {
      this.state.isSaveButtonDisabled[e.target.name] = false
    }
  }

  handleShowItemMenu(item, event) {
    console.log("item in show button:", item);
    if (item._links) {
      let anchorEl = this.state.anchorEl;
      anchorEl[item._links.self.href] = event.currentTarget;
      this.setState({ anchorEl });
    }
  }

  handleCloseItemMenu(item, event) {
    if (item._links) {
      let anchorEl = this.state.anchorEl;
      anchorEl[item._links.self.href] = null;
      this.setState({ anchorEl });
    }
  }

  render() {
    const { classes, pillars } = this.props;

    return (
      < Grid
        container
        spacing={8}
        direction="row"
        justify="space-between"
        alignItems="stretch" >
        {pillars.map((pillar, idx) => (
          < Grid item key={pillar.title} xs={12} sm={12} md={4} >
            <Card>
              <CardHeader
                title={pillar.title}
                subheader={pillar.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                action={null}
              />
              <CardContent>
                <Grid container alignItems="baseline" justify="space-evenly" >
                  <Grid item xs={11} sm={9} md={10}>
                    <TextField
                      id="createNewItem"
                      key={pillar._links.self.href}
                      label="New item"
                      fullWidth
                      name={pillar._links.self.href}
                      value={this.state.newItems[pillar._links.self.href]}
                      onChange={this.handleNewItemChange.bind(this)}
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      disabled={this.state.isSaveButtonDisabled[pillar._links.self.href]}
                      aria-label="Add new item"
                      onClick={this.handleNewItemSave.bind(this, idx, pillar._links.self.href)}
                    >
                      <Save />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>

              {pillar.items && pillar.items.map(item => (
                <ExpansionPanel
                  key={item.title}
                  expanded={this.state.expandedItem === item._links.self.href}
                  onChange={this.handleItemExpandToggle.bind(this, item)}
                >

                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant={'subheading'} style={{ paddingRight: 15 }} className={item.checked ? classes.itemDone : null}>
                      {item.title}
                    </Typography>

                    {item.likes > 0 && item.likes <= 2 && (
                      <SignalCellular1BarRounded style={{ paddingTop: 4, paddingLeft: 10 }} fontSize='inherit' />
                    )}
                    {item.likes > 3 && item.likes <= 4 && (
                      <SignalCellular2BarRounded style={{ paddingTop: 4, paddingLeft: 10 }} fontSize='inherit' />
                    )}
                    {item.likes > 4 && item.likes <= 6 && (
                      <SignalCellular3BarRounded style={{ paddingTop: 4, paddingLeft: 10 }} fontSize='inherit' />
                    )}
                    {item.likes > 6 && (
                      <SignalCellular4BarRounded style={{ paddingTop: 4, paddingLeft: 10 }} fontSize='inherit' />
                    )}

                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography >
                      Nulla facilisi.
                    </Typography>
                  </ExpansionPanelDetails>

                  <ExpansionPanelActions>
                    <IconButton onClick={this.handleItemDone.bind(this, idx, item)}>
                      <Done />
                    </IconButton>
                    <IconButton onClick={this.handleItemDelete.bind(this, idx, item)}>
                      <DeleteOutline />
                    </IconButton>
                    <IconButton onClick={this.handleNewLikeSave.bind(this, idx, item)}>
                      <PlusOne />
                    </IconButton>
                  </ExpansionPanelActions>
                </ExpansionPanel>
              ))}
            </Card>
          </Grid>
        ))}
      </Grid >
    )
  }
}

Pillars.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Pillars);
