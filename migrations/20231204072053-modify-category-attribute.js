'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      name_en: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.STRING
      },
      google_map: {
        type: Sequelize.TEXT
      },
      rating: {
        type: Sequelize.DECIMAL(3, 1)
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants')
  }
}
