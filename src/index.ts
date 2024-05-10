import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Checkpoint, { LogLevel } from '@snapshot-labs/checkpoint';
import config from './config.json';
import * as writers from './writers';
import checkpointBlocks from './checkpoints.json';
import Poster from './abis/Poster.json';

const dir = __dirname.endsWith('dist/src') ? '../' : '';
const schemaFile = path.join(__dirname, `${dir}../src/schema.gql`);
const schema = fs.readFileSync(schemaFile, 'utf8');

const checkpoint = new Checkpoint(config, writers, schema, {
  logLevel: LogLevel.Info,
  prettifyLogs: true,
  fetchInterval: 15000,
  abis: {
    Poster
  }
});

async function run() {
  await checkpoint.reset();
  await checkpoint.resetMetadata();
  await checkpoint.seedCheckpoints(checkpointBlocks);
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
