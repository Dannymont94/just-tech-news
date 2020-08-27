const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
  // Access our User model and run .findAll() method
  User.findAll({
    attributes: {
      exclude: ['password']
    }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user found with this id' });
      }
      return res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// use post for login route instead of get so that password and other sensitive information is stored in req.body instead of as plaintext in the url
router.post('/login', (req, res) => {
  // expects { email: 'lernantino@gmail.com', password: 'pw1234 }
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async (dbUserData) => {
      if (!dbUserData) {
        return res.status(400).json({ message: 'No user with that email address!' });
      }
      const isValidPassword = await dbUserData.checkPassword(req.body.password);

      if (!isValidPassword) {
        return res.status(400).json({ message: 'Incorrect password!' });
      }
      return res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}, but you can use req.body if the key value pairs match the model's column names exactly
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        return res.status(404).json({ message: 'No user found with this id' });
      }
      return res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user found with this id' });
      }
      return res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json(err);
    });
});

module.exports = router;