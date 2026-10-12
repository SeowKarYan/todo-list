'use strict';

const bcrypt = require("bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let now = new Date()
    let data = [{
      username: "test-account",
      password: bcrypt.hashSync("123456", 10),
      createdAt: now,
      updatedAt: now,
    }]

    await queryInterface.bulkInsert('user', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
