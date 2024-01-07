'use strict'

const bcrypt = require('bcryptjs')
const initData = require('../public/jsons/restaurant.json').results

initData.forEach((data) => {
  const userId = data.id >= 1 && data.id <= 4 ? 1 : 2
  data.userId = userId
  data.createdAt = new Date()
  data.updatedAt = new Date()
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction
    try {
      transaction = await queryInterface.sequelize.transaction()

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash('12345678', salt)
      await queryInterface.bulkInsert(
        'Users',
        [
          {
            id: 1,
            name: 'user1',
            email: 'user1@example.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: 'user2',
            email: 'user2@example.com',
            password: hash,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        { transaction }
      )

      await queryInterface.bulkInsert('Restaurants', initData, { transaction })

      await transaction.commit()
    } catch (error) {
      if (transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}
