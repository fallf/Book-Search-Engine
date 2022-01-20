// libraries
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
// const routes = require('./routes');

// custom files
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// Set up apollo server
const app = express();
const PORT = process.env.PORT || 3000;
async function startServer() {
  apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// app.use(routes);
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
});

