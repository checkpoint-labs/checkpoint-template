# Checkpoint Starter Template

This is a template to quickly get started to use [Checkpoint](https://docs.checkpoint.fyi)
to expose a GraphQL API to query data from your StarkNet contracts.

## Getting Started

This starter project contains logic to index events from a StarkNet Poster contract that is defined in the
[starknet-poster](https://github.com/snapshot-labs/starknet-poster/blob/master/contracts/Poster.cairo) repository.

**Requirements**

- Node.js (>= 14.x.x)
- MySQL (v8.0)
- Yarn

> You can also use npm, just make sure to replace the subsequent 'yarn' commands with their npm equivalent.

After cloning this project, run the following command to install dependencies:

```bash
yarn # or 'npm install'
```

Next, start up the server:

```bash
yarn start
```

This will expose an GraphQL API endpoint locally at http://localhost:3000/graphql.

You can easily interact with this endpoint using the graphiql interface by visiting http://localhost:3000/graphiql in your browser.

To fetch a list of Post's try the following query:

```graphql
query {
	posts {
		id
		poster
		content
		tag
		created_at
	}
}
```

To learn more about the different ways you can query the GraphQL API, visit the Checkpoint documentation [here](https://docs.checkpoint.fyi/core-concepts/entity-schema).

## Exploring the Codebase

> TODO

## License

MIT
