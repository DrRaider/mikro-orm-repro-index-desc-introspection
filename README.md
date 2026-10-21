# MikroORM reproduction: `DESC` index column introspected as `ASC`

An index on `(author_id, created_at DESC, id DESC)` is created correctly, but the schema diff right after
`schema.create()` drops and recreates it: introspection reads `id DESC` as `ASC`, because the pattern looking for
`id` in `author_id, created_at DESC, id DESC` first matches the end of `author_id`.

Uses the PGlite driver (in-process Postgres), no database setup needed:

```sh
npm install
npm test
```

Reproduces on 7.2.5 (latest).
