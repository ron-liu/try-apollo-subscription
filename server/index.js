import express from 'express';
import {
	graphqlExpress,
	graphiqlExpress,
} from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import 'babel-polyfill'

import schema from './schema';

const PORT = 3001;
const server = express();

server.use(cors());

server.use('/graphql', bodyParser.json(), graphqlExpress({
	schema
}));

server.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

// Wrap the Express server
const ws = createServer(server);
ws.listen(PORT, () => {
	console.log(`Apollo Server is now running on http://localhost:${PORT}`);
// Set up the WebSocket for handling GraphQL subscriptions
new SubscriptionServer({
	execute,
	subscribe,
	schema
}, {
	server: ws,
	path: '/subscriptions',
});
});