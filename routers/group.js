import express from 'express';
import groupSvc from '../services/group.js';

const routes = express.Router();


routes.get('/:id', async (req, res) => {
  respondWithGroup(res, req.params.id);
});


routes.delete('/:id', async (req, res) => {
  try {
    await groupSvc.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    console.error('error delete group', err);
    res.sendStatus(500);
  }
});


routes.post('/search', async (req, res) => {
  const { name } = req.body;
  try {
    const groups = await groupSvc.searchByName(name);
    res.json(groups);
  } catch (err) {
    console.error('error search group:', err);
    res.sendStatus(500);
  }
});


routes.post('/', async (req, res) => {
  const group = req.body;
  try {
    const newGroups = await groupSvc.findOrCreateByName(group.name);
    if (newGroups.length !== 2) {
      console.error('error finding unique group:');
      res.sendStatus(500);
      return;
    }
    const newGroup = newGroups[0];
    group.members && group.members.map(async id => {
      await newGroup.addMembers(id);
    });
    await respondWithGroup(res, newGroup.id);
  } catch (err) {
    console.error('error post group:', err);
    res.sendStatus(500);
  }
});


routes.post('/member', async (req, res) => {
  try {
    const { userID, groupID } = req.body;
    if (userID && groupID) {
      await groupSvc.addMember(groupID, userID);
      await respondWithGroup(res, groupID);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error('error patch group:', err);
    res.sendStatus(500);
  }
});


routes.post('/facilitator', async (req, res) => {
  try {
    const { groupID, facilitatorID } = req.body;
    await groupSvc.setFacilitator(groupID, facilitatorID);
    await respondWithGroup(res, groupID);
  } catch (err) {
    console.error('error patch group:', err);
    res.sendStatus(500);
  }
});


const respondWithGroup = async (res, id) => {
  try {
    const group = await groupSvc.findOne({ id });
    if (group) {
      res.json(group);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error('error get group', err);
    res.sendStatus(500);
  }
};


export default routes;
