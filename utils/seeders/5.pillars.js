'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = '2019-10-26 02:53:15.452';
    return queryInterface.bulkInsert('Pillars', [
      { id: '87DC40EC-6E38-4BE0-8A06-FD4657217A07', position: 0, title: 'Happy', boardID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07', createdAt: date, updatedAt: date },
      { id: '5FADA8E0-987D-400C-9A81-FA751D5399AE', position: 1, title: 'Med', boardID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07', createdAt: date, updatedAt: date },
      { id: '9717449B-A200-4BA4-8F10-5182AAEB1E6D', position: 2, title: 'Sad', boardID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07', createdAt: date, updatedAt: date },
    ], {});
  },

  down: (queryInterface, Sequelize) => {},
};
