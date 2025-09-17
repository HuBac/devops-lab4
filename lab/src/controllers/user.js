const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if (!user.username) {
      return callback(new Error("Wrong user parameters"), null)
    }

    // User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }

    // Check if user already exists
    db.exists(user.username, (err, exists) => {
      if (err) return callback(err, null)

      if (exists) {
        return callback(new Error("User already exists"), null)
      }

      // Save new user
      db.hmset(user.username, userObj, (err, res) => {
        if (err) return callback(err, null)
        callback(null, res) // "OK"
      })
    })
  },

  // get method still TODO
}
