import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/pglite';
import { Entity, Index, PrimaryKey, Property, ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';

@Entity()
@Index({
  name: 'book_author_created_idx',
  columns: [{ name: 'authorId' }, { name: 'createdAt', sort: 'DESC' }, { name: 'id', sort: 'DESC' }],
})
class Book {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'number' })
  authorId!: number;

  @Property({ type: 'Date' })
  createdAt!: Date;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({ dbName: 'memory://', entities: [Book], metadataProvider: ReflectMetadataProvider });
  await orm.schema.create();
});

afterAll(async () => {
  await orm.close(true);
});

test('no schema diff right after create for an index with a DESC column whose name ends another column', async () => {
  // `id DESC` is introspected as ASC: the column pattern for `id` first matches the end of `author_id`.
  expect(await orm.schema.getUpdateSchemaSQL({ wrap: false })).toBe(''); // fails: drop index + create index
});
