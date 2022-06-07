# Checkpoint Starter Template

This is a template to quickly get started to use [Checkpoint](https://docs.checkpoint.fyi)
to expose a GraphQL API to query data from your StarkNet contracts.

## Getting Started

This starter project contains logic to index events from a StarkNet Poster contract that is defined in the
[starknet-poster](https://github.com/snapshot-labs/starknet-poster/blob/master/contracts/Poster.cairo) repository.

Create a copy of this repository by clicking **'Use this template'** button or clicking [this
link](https://github.com/snapshot-labs/checkpoint-template/generate).

**Requirements**

- Node.js (>= 16.x.x)
- MySQL (v8.0)
- Yarn

> You can also use npm, just make sure to replace the subsequent 'yarn' commands with their npm equivalent.

After cloning this project, run the following command to install dependencies:

```bash
yarn # or 'npm install'
```

Next, you'll need a MySQL server running and a connection string available as environment variable `DATABASE_URL`.

> For local development, you can create a .env file from the .env.example file and the application will read the values on startup.

Next, start up the server:

```bash
yarn dev # for local development or else `yarn start` for production build.

```

This will expose a GraphQL API endpoint locally at http://localhost:3000. You can easily interact with this endpoint using the graphiql interface by visiting http://localhost:3000 in your browser.

To fetch a list of Post's try the following query:

```graphql
query {
	posts {
		id
		author
		content
		tag
		created_at_block
		created_at
		tx_hash
	}
}
```

To learn more about the different ways you can query the GraphQL API, visit the Checkpoint documentation [here](https://docs.checkpoint.fyi/core-concepts/entity-schema).

## License

MIT
