import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from '@/entities/Post';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/blog.sqlite';

const dbDir = path.dirname(path.resolve(DATABASE_PATH));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: path.resolve(DATABASE_PATH),
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [Post],
  });

  await dataSource.initialize();
  return dataSource;
}

export async function getPostRepository() {
  const ds = await getDataSource();
  return ds.getRepository(Post);
}
