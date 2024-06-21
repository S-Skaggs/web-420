var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const name = 'name' in req.query ? req.query.name : 'Superhero';
  res.render('superhero', {name: name});
});

/* GET Batman */
router.get('/batman', async (req, res, next) => {
  try {
    const batman = {
      name: 'Batman', 
      realName: 'Bruce Wayne',
      city: 'Gotham City',
      superpower: 'Rich',
      allies: ['Robin', 'Batgirl', 'Superman'],
      enemies: ['Joker', 'Two-Face', 'Bane']
    }

    res.send(batman);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
