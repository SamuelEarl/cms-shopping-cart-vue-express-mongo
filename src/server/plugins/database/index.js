"use strict";

// Imports
const neo4j = require("neo4j-driver").v1;

exports.plugin = {
  pkg: require("./package.json"),
  register: async function(server, options) {

    // ============================
    // Database connection data
    // ============================
    const uri = options.uri;
    const user = options.user;
    const password = options.password;

    // This try block will connect to the database
    try {
      // Connect to the Neo4j server through the driver and save that connection to a variable called "driver".
      const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
      // Create a variable called "session" that acts as a reference to the database object.
      // You will use session.run("<CYPHER QUERY>") anytime you want to run a CRUD operation against the database.
      const session = driver.session();

      // Add the session database object to the server.app namespace
      server.app.session = session;

      if (driver) {
        console.log(`Connected to Neo4j database on ${driver._hostPort}`);
      }

      await server.logger().info(driver);
    }
    catch(err) {
      console.log("DATABASE CONNECTION ERROR:", err);
      await server.logger().error(err);
    }
  }
};
