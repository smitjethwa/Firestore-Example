const functions = require('firebase-functions');
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');

// initialise DB connection
const admin = require('firebase-admin');
admin.initializeApp({
  credential: <> ,
  databaseURL: 'https://planets-8cbb1.firebaseio.com/',
});

process.env.DEBUG = 'dialogflow:debug';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

function handlePlanets(agent) {
  const planet_name = agent.parameters.planet_name;
  return admin.database().ref(planet_name).once("value").then((snapshot) => {
  	var image_url = snapshot.child("image_url").val();
   	var btn_url = snapshot.child("btn_url").val();
   	var text = snapshot.child("text").val();
   	agent.add('Information about ' + planet_name);
  	agent.add(new Card({
       	title: planet_name,
       	imageUrl: image_url,
        	text: text,
        	buttonText: 'Read More on Wikipedia',
        	buttonUrl: btn_url
      	})
   );
      	suggestions = ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune'];
    	if (planet_name=='Earth'){
        	agent.add(new Suggestion("Oceans"));
			agent.add(new Suggestion("Continents"));
          	agent.add(new Suggestion("Home"));
        }
    	else{
      		var i;
			for (i = 0; i < suggestions.length; i++) {
              if (suggestions[i]!=planet_name){
                  agent.add(new Suggestion(suggestions[i]));
              }
          }	
          agent.add(new Suggestion('Home'));
        }
    });
  }
  //function planetList(agent) {
    //agent.add("There are total 8 Planets in the solar system. The order of the planets in the solar system, starting nearest the sun and working outward is the following: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.");
    
  //}
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('information', handlePlanets);
  agent.handleRequest(intentMap);
});
