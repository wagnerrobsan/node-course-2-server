const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) =>{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);

  fs.appendFile('server.log', log+ '\n', (err)=>{
    if (err) {
      console.log('Unable to append to server.log.')
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

hbs.registerHelper('screamJson', (json) => {
  var jsonData = '';
  for (var key in json){
    jsonData += `<h3>${json[key].name} </h3>\n`;
    jsonData += `<p><b>Period:</b> ${json[key].period} </p> \n`;
    jsonData += `<p><b>Description:</b> ${json[key].description} </p><br>`;
  }
  return new hbs.handlebars.SafeString(jsonData);
});


app.get('/', (req, res) => {
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to Wagner\'s Website! NodeJS rocks!!!'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs',{
    pageTitle: 'Portfolio Page',
    project:
      [
        {
        name: 'New Aerlingus website',
        period: 'Apr 2014 to Aug 2015',
        description: 'Project to completely redesign the Aerlingus website for better usability, aesthetics, backend processes and integrations using new technologies .'
         },
        {name: 'Predictive IVR (IIVR)',
         period: 'May 2010 – Dec 2010',
         description: 'Project deployment of IP Predictive IVR (Huawei) at TIM Brazil with 9,000 doors, for service to postpaid customers. <br> This new Predictive IVR enabled the development and activation of a new portfolio of services'}
      ]
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    status: 'Error',
    message: 'Doesn\'t work!!'
  });
});

app.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
