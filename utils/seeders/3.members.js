module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = '2019-10-26 02:53:15.452';
    return queryInterface.bulkInsert('GroupMember', [
      { groupID: '87DC40EC-6E38-4BE0-8A06-FD4657217A07', userID: '8984FA00-70C2-47D6-B285-D983A401FAC7', createdAt: date, updatedAt: date },
      { groupID: '5FADA8E0-987D-400C-9A81-FA751D5399AE', userID: 'A6A71200-A453-4340-915D-E28079042B56', createdAt: date, updatedAt: date },
      { groupID: '9717449B-A200-4BA4-8F10-5182AAEB1E6D', userID: '52D8DC68-7289-4ECF-AE41-F77DB4B09C73', createdAt: date, updatedAt: date },
      { groupID: 'ED64464D-034E-4D42-9651-7CD885D764D2', userID: '2FE424C3-9AA4-4762-8354-2412B9F04B19', createdAt: date, updatedAt: date },
    ], {});
  },
  down: (queryInterface, Sequelize) => {},
};
