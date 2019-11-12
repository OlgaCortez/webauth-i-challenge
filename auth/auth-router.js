const bcrypt = require('bcryptjs');
const router = require('express').Router();

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let userInformation = req.body;

  const hash = bcrypt.hashSync(userInformation.password, 12);
  userInformation.password = hash;

  Users.add(userInformation)
    .then(saved => {
      req.session.username = saved.username;
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
      res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({message: 'Follow the yellow brick road'});
      } else {
        res.status(200).json({message: 'Logged out successfully'});
      }
    });
  } else {
    res.status(200).json({ message: 'Bye!'})
  }
});

module.exports = router;
