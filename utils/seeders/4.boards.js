'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = '2019-10-26 02:53:15.452';
    return queryInterface.bulkInsert('Boards', [
      { id: '87DC40EC-6E38-4BE0-8A06-FD4657217A07',
        name: 'Retro',
        chat: 'fakeLink',
        stage: 'created',
        locked: false,
        timer: 60,
        groupID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07',
        createdAt: date,
        updatedAt: date,
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {},
};
