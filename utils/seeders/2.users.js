module.exports = {
  up: (queryInterface, Sequelize) => {
    const date = '2019-10-26 02:53:15.452';
    return queryInterface.bulkInsert('Users', [
      { id: '8984FA00-70C2-47D6-B285-D983A401FAC7', firstName: 'Jim', lastName: 'Halpert', email: 'jim@dundermifflin.com', microsoftID: '', last: date, accessToken: 'fakeToken', createdAt: date, updatedAt: date },
      { id: 'A6A71200-A453-4340-915D-E28079042B56', firstName: 'Dwight', lastName: 'Schrute', email: 'dwight@dundermifflin.com', microsoftID: '', last: date, accessToken: 'fakeToken', createdAt: date, updatedAt: date },
      { id: '52D8DC68-7289-4ECF-AE41-F77DB4B09C73', firstName: 'Michael', lastName: 'Scott', email: 'michael@dundermifflin.com', microsoftID: '', last: date, accessToken: 'fakeToken', createdAt: date, updatedAt: date },
      { id: '2FE424C3-9AA4-4762-8354-2412B9F04B19', firstName: 'Pam', lastName: 'Beesly', email: 'pam@dundermifflin.com', microsoftID: '', last: date, accessToken: 'fakeToken', createdAt: date, updatedAt: date },
    ], {});
  },
  down: (queryInterface, Sequelize) => {},
};
