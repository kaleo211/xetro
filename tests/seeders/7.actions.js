'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = '2019-10-26 02:53:15.452';
    return queryInterface.bulkInsert('Items', [
      {
        id: '87DC40EC-6E38-4BE0-8A06-FD4657217A07',
        title: 'Finish this',
        likes: 10,
        stage: 'created',
        type: 'action',
        end: date,
        boardID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07',
        groupID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07',
        pillarID: '5FADA8E0-987D-400C-9A81-FA751D5399AE',
        ownerID: '8984FA00-70C2-47D6-B285-D983A401FAC7',
        itemID: 'E0F9A41F-7BBA-415B-9CC4-8754FE99C86B',
        createdAt: date,
        updatedAt: date,
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {},
};
