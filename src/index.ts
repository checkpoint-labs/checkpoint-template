import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Checkpoint, { LogLevel, evm } from '@snapshot-labs/checkpoint';
import config from './config.json';
import * as writers from './writers';
import ProxyFactory from './abis/ProxyFactory.json';

const dir = __dirname.endsWith('dist/src') ? '../' : '';
const schemaFile = path.join(__dirname, `${dir}../src/schema.gql`);
const schema = fs.readFileSync(schemaFile, 'utf8');

const indexer = new evm.EvmIndexer(writers);

// Initialize checkpoint
const checkpoint = new Checkpoint(config, indexer, schema, {
  logLevel: LogLevel.Info,
  resetOnConfigChange: true,
  abis: {
    ProxyFactory
  },
  prettifyLogs: true // uncomment in local dev
});

async function run() {
  await checkpoint.reset();
  await checkpoint.resetMetadata();
  await checkpoint.start();
}

run();

const app = express();
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: false }));
app.use(cors({ maxAge: 86400 }));
app.use('/', checkpoint.graphql);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
