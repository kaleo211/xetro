'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = '2019-10-26 02:53:15.452';
    return queryInterface.bulkInsert('Groups', [
      { id: '87DC40EC-6E38-4BE0-8A06-FD4657217A07', name: 'Cambridge', createdAt: date, updatedAt: date },
      { id: '5FADA8E0-987D-400C-9A81-FA751D5399AE', name: 'Hopkinton', createdAt: date, updatedAt: date },
      { id: '9717449B-A200-4BA4-8F10-5182AAEB1E6D', name: 'OCTO', createdAt: date, updatedAt: date },
      { id: 'ED64464D-034E-4D42-9651-7CD885D764D2', name: 'TRIGr', createdAt: date, updatedAt: date },
    ], {});
  },

  down: (queryInterface, Sequelize) => {},
};
