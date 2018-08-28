import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Done from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlusOne from '@material-ui/icons/PlusOne';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Likes from './Likes';
import Action from './Action';

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
      expandedItem: "",
    }
  }

  componentWillReceiveProps(props) {
    let pillars = props.pillars;
    let isSaveButtonDisabled = [];

    if (pillars) {
      console.log("pillars in pillars:", pillars);
      let newItems = {};
      for (let idx = 0; idx < pillars.length; idx++) {
        let pillar = pillars[idx];
        let pillarHref = pillar._links.self.href;
        newItems[pillarHref] = "";
        isSaveButtonDisabled[pillarHref] = true;
      }
      this.setState({ newItems, isSaveButtonDisabled });
    }
  }

  handleNewLikeSave(item, event) {
    let updatedItem = {
      title: item.title,
      likes: item.likes + 1,
    }
    console.log("item to add like", JSON.stringify(item));
    console.log("item patch link:", item._links.self.href.replace('{?projection}', ''));

    fetch(item._links.self.href.replace('{?projection}', ''), {
      method: 'PATCH',
      body: JSON.stringify(updatedItem),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillars();
      } else {
        console.log("failed to post new like")
      }
    })
  }

  handleItemDone(item, event) {
    item.checked = true;
    console.log("item done link:", item);
    fetch(item._links.self.href.replace('{?projection}', ''), {
      method: 'PATCH',
      body: JSON.stringify(item),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillars();
        this.handleItemExpandToggle(item, event);
      } else {
        console.log("failed to update item resp:", resp);
      }
    })
  }

  handleNewItemSave(pillar, event) {
    if (event && event.key === 'Enter') {
      console.log("i am here")
      let newItem = {
        title: this.state.newItems[pillar],
        pillar: pillar,
      }

      fetch("http://localhost:8080/api/items", {
        method: 'post',
        body: JSON.stringify(newItem),
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }).then(resp => {
        if (resp.ok) {
          this.props.updatePillars();
          this.state.newItems[pillar] = "";
        } else {
          throw new Error('failed to post new item');
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }

  handleItemDelete(item, event) {
    fetch(item._links.self.href.replace('{?projection}', ''), {
      method: 'delete',
    }).then(resp => {
      if (resp.ok) {
        this.props.updatePillars();
      } else {
        console.log("failed to delete item resp:", resp);
      }
    });
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
                <TextField
                  id="createNewItem"
                  key={pillar._links.self.href}
                  label="New item"
                  fullWidth
                  name={pillar._links.self.href}
                  value={this.state.newItems[pillar._links.self.href]}
                  onChange={this.handleNewItemChange.bind(this)}
                  onKeyPress={this.handleNewItemSave.bind(this, pillar._links.self.href)}
                />
              </CardContent>

              {pillar.items && pillar.items.map(item => (
                <ExpansionPanel
                  key={item.title}
                  expanded={this.state.expandedItem === item._links.self.href}
                  onChange={this.handleItemExpandToggle.bind(this, item)}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant={'title'} style={{ paddingRight: 15 }} className={item.checked ? classes.itemDone : null}>
                      {item.title}
                    </Typography>
                    <Likes item={item} />
                  </ExpansionPanelSummary>

                  <ExpansionPanelDetails>
                    <Action item={item} members={this.props.members} pillar={pillar} updatePillars={this.props.updatePillars} />
                  </ExpansionPanelDetails>

                  <ExpansionPanelActions style={{ paddingTop: 0 }} >
                    <IconButton disabled={item.checked} onClick={this.handleItemDone.bind(this, item)}>
                      <Done />
                    </IconButton>
                    <IconButton onClick={this.handleItemDelete.bind(this, item)}>
                      <DeleteOutline />
                    </IconButton>
                    <IconButton onClick={this.handleNewLikeSave.bind(this, item)}>
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
