'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.changeColumn('Restaurants', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.changeColumn('Restaurants', 'image', {
      type: Sequelize.TEXT,
      allowNull: false
    })
    await queryInterface.changeColumn('Restaurants', 'location', {
      type: Sequelize.TEXT,
      allowNull: false
    })
    await queryInterface.changeColumn('Restaurants', 'phone', {
      type: Sequelize.STRING,
      allowNull: false
    })
    await queryInterface.changeColumn('Restaurants', 'rating', {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'name', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.changeColumn('Restaurants', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.changeColumn('Restaurants', 'image', {
      type: Sequelize.TEXT,
      allowNull: true
    })
    await queryInterface.changeColumn('Restaurants', 'location', {
      type: Sequelize.TEXT,
      allowNull: true
    })
    await queryInterface.changeColumn('Restaurants', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    })
    await queryInterface.changeColumn('Restaurants', 'rating', {
      type: Sequelize.DECIMAL(3, 1),
      allowNull: true
    })
  }
}
