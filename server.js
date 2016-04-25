var bcrypt = require('bcrypt')
var config = require('./config.js')
var knex = config.knex
var app = config.app


//=========================================//
//========== GET routes ===================//
//=========================================//

app.get('/', function (req, res) {
  res.render('signIn');
});

app.get('/newTweet', function(req, res) {
  res.render('tweetPost', { id: req.session.userId })
//  console.log('this is req.session: ', req.session)
})

app.get('/signUp', function (req, res) {
  res.render('signUp');
});

app.get('/signIn', function (req, res) {
  res.render('signIn');
});

app.get('/secret', function(req, res){
    res.render('secret', { id: req.session.userId })
})

app.get('/allTweets', function (req, res) {
  knex.select().table('tweets')
  .then(function(data) {
    res.render('viewAllTweets', { id: req.session.userId, data: data })
  })
})

app.get('/signOut', function (req, res) {
  req.session.destroy()
  res.render('signOut');
})

//=========================================//
//============= POST routes ===============//
//=========================================//

app.post('/newTweet', function (req, res) {
    // console.log('this is req.body:', req.body)
  knex('tweets').insert({ tweeted: req.body.tweeted })
  .then(function(data){
    res.redirect('allTweets')
    console.log('success')
  })
})

app.post('/signIn', function(req, res){
  knex.select().table('users')
    .then(function(data) {
      console.log('data', data[0].id)
      // console.log(data)
      // for (i = 0; i < data.length; i++){
      //   console.log(data[i].hashed_password)
      // }
      if (bcrypt.compareSync( req.body.password, data[0].hashed_password )) {
        req.session.userId = data[0].id
        res.redirect('/secret')
        console.log('success')
      }
      else {
        res.redirect('/signIn')
      }
    })
    .catch(function(error){
      console.log('there has been a problem: ', error)
      req.session.userId = 0
      res.redirect('/signUp')
    })
  })

app.post('/signUp', function (req, res) {
  var hash = bcrypt.hashSync( req.body.password, 10 )
  knex('users').insert({ email: req.body.email, hashed_password: hash })
  .then(function(data){
    console.log('this is data from sign-up', data)
    req.session.userId = data
    res.redirect('/secret')
  })
  .catch(function(error){
    console.log(error, 'problem')
    req.session.userId = 0
    res.redirect('/')
  })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000! Yep! Its true!');
});
