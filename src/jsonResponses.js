// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

//function to respond with a json object
//takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//function to respond without json body
//takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};



// function to send response
const respond = (request, response, content, status) => {
  // set status code (200 success) and content type
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  // write the content string or buffer to response
  response.write(content);
  // send the response to the client
  response.end();
};

//return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users
  };

  respondJSON(request, response, 200, responseJSON);
};

//function to add a user from a POST body
const addUser = (request, response, body) => {
  //default json message
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  //check to make sure we have both fields
  //We might want more validation than just checking if they exist
  //This could easily be abused with invalid types (such as booleans, numbers, etc)
  //If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //default status code to 201 created
  let responseCode = 201;

  //if that user's name already exists in our object
  //then switch to a 204 updated status
  if (users[body.name]) {
    responseCode = 204;
  } else {
    //otherwise create an object with that name
    users[body.name] = {};
  }

  //add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  //if response is created, then set our created message
  //and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    //return respondJSON(request, response, responseCode, responseJSON);
      
          // create a valid XML string with name and age tags.
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>This is a successful response</message>`;
    responseXML = `${responseXML} <id>success</id>`;
    responseXML = `${responseXML} </response>`;

    // return response passing out string and content type
    return respond(request, response, responseXML, 200);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

//public exports
module.exports = {
  getUsers,
  addUser,
};
