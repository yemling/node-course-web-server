const express = require('express');
const hbs = require('hbs'); //handlebar template
const fs = require('fs');
const port = process.env.PORT || 3000; //process.env === available environment variables || if first undefined use the second one.
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('View engine', 'hbs');

//next tells the function when it's done.
app.use((request, response, next) => {
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server log.');
        }
    });
    next();
});

//stops further processing if no next() called, useful for when website under maintenance.
/* app.use((request, response, next) => {
    response.render('maintenance.hbs', {
        pageTitle: 'Maintenance',
        welcomeMessage: 'Under construction'
    })
}); */

//set main folder to show stuff using express middleware
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//express knows what mimetype to return without having to specify it.
//this returns json
app.get('/', (request, response) => {
    //response.send('<h1>Hello express!</h1>');
    /* response.send({
        name: 'Gemma',
        likes: [
            'Dogs', 'Walking', 'Coding'
        ]
    }); */
    response.render('home.hbs', {
        pageTitle: 'Home page',
        welcomeMessage: 'Hi there'
    });
});

//this returns html
app.get('/about', (request, response) => {
    //response.send('<h1>About express!</h1>');
    response.render('about.hbs', {
        pageTitle: 'About page'
    });
});

//use this to handle errors
app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Something went wrong'
    });
});

//heroku environment variable
app.listen(port, () => {
    console.log(`Server is up on port ${port}`); //logs to cmd
});