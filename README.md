<p align="center">
  <img width="192" src="https://github.com/vuex-orm/vuex-orm/raw/master/logo-vuex-orm.png" alt="Vuex ORM">
</p>

<h1 align="center">Vuex ORM</h1>

<p align="center">
  <a href="https://travis-ci.org/vuex-orm/vuex-orm">
    <img src="https://travis-ci.org/vuex-orm/vuex-orm.svg?branch=master" alt="Travis CI">
  </a>
  <a href="https://codecov.io/gh/vuex-orm/vuex-orm">
    <img src="https://codecov.io/gh/vuex-orm/vuex-orm/branch/master/graph/badge.svg" alt="codecov">
  </a>
  <a href="https://www.npmjs.com/package/@vuex-orm/core">
    <img alt="npm" src="https://img.shields.io/npm/v/@vuex-orm/core?color=blue" alt="NPM">
  </a>
  <a href="https://standardjs.com">
    <img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide">
  </a>
  <a href="https://github.com/vuex-orm/vuex-orm/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/@vuex-orm/core.svg" alt="License">
  </a>
</p>

Vuex ORM is a plugin for [Vuex](https://github.com/vuejs/vuex) to enable Object-Relational Mapping access to the Vuex Store. Vuex ORM lets you create "normalized" data schema within Vuex Store with relationships such as "Has One" and "Belongs To Many" like any other usual ORM library. It also provides fluent API to get, search and update Store state.

Vuex ORM is heavily inspired by Redux recipe of ["Normalizing State Shape"](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape) and ["Updating Normalized Data"](https://redux.js.org/recipes/structuring-reducers/updating-normalized-data). Learn more about the concept and motivation of Vuex ORM at [What is Vuex ORM?](https://vuex-orm.github.io/vuex-orm/guide/prologue/what-is-vuex-orm.html).

## Sponsors

Vuex ORM is sponsored by awesome folks. Big love to all of them from whole Vuex ORM community :two_hearts:

### Super Love Sponsors

<a href="https://github.com/petertoth">
  <img src="https://avatars2.githubusercontent.com/u/3661783?s=460&v=4" alt="Peter Tóth" width="88">
</a>
<a href="https://github.com/phaust">
  <img src="https://avatars1.githubusercontent.com/u/2367770?s=460&v=4" alt="Mario Kolli" width="88">
</a>
<a href="https://github.com/cannikan">
  <img src="https://avatars2.githubusercontent.com/u/21893904?s=460&v=4" alt="Cannikan" width="88">
</a>
<a href="https://github.com/somazx">
  <img src="https://avatars0.githubusercontent.com/u/7306?s=460&v=4" alt="Andy Koch" width="88">
</a>

#### Big Love Sponsors

<a href="https://github.com/geraldbiggs">
  <img src="https://avatars1.githubusercontent.com/u/3213608?s=460&v=4" alt="geraldbiggs" width="64">
</a>

#### A Love Sponsors

<a href="https://github.com/georgechaduneli">
  <img src="https://avatars1.githubusercontent.com/u/9340753?s=460&v=4" alt="George Chaduneli" width="48">
</a>
<a href="https://github.com/bpuig">
  <img src="https://avatars3.githubusercontent.com/u/22938625?s=460&v=4" alt="bpuig" width="48">
</a>
<a href="https://github.com/cuebit">
  <img src="https://avatars0.githubusercontent.com/u/1493221?s=460&v=4" alt="Cue" width="48">
</a>

## Documentation

You can check out the full documentation for Vuex ORM at https://vuex-orm.github.io/vuex-orm.

## Questions & Discussions

Join us on our [Slack Channel](https://join.slack.com/t/vuex-orm/shared_invite/enQtNDQ0NjE3NTgyOTY2LTc1YTI2N2FjMGRlNGNmMzBkMGZlMmYxOTgzYzkzZDM2OTQ3OGExZDRkN2FmMGQ1MGJlOWM1NjU0MmRiN2VhYzQ) for any questions and discussions.

Although there is the Slack Channel, do not hesitate to open an [issue](https://github.com/vuex-orm/vuex-orm/issues) for any question you might have. We're always more than happy to hear any feedback, and we don't care what kind of form they are.

## Examples

You can find example applications built using Vuex ORM at;

- [Vuex ORM Examples](https://github.com/vuex-orm/vuex-orm-examples) – Simple ToDo App built on top of a plain Vue structure generated by [Vue CLI](https://cli.vuejs.org/).
- [Vuex ORM Examples Nuxt](https://github.com/vuex-orm/vuex-orm-examples-nuxt) – Simple ToDo App built on top of [Nuxt.js](https://nuxtjs.org/).

## Quick Start

Here's a very simple quick start guide that demonstrates how it feels like to be using Vuex ORM.

### Install Vuex ORM

Install Vuex ORM with npm or yarn.

```bash
$ npm install @vuex-orm/core
# OR
$ yarn add @vuex-orm/core
```

### Define Models

First, let's declare our models extending Vuex ORM `Model`. Here we assume that there are Post model and User model. Post model has a relationship with User – the post "belongs to" a user by the `author` key.

```js
// User Model
import { Model } from '@vuex-orm/core'

export default class User extends Model {
  // This is the name used as module name of the Vuex Store.
  static entity = 'users'

  // List of all fields (schema) of the post model. `this.attr` is used
  // for the generic field type. The argument is the default value.
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      email: this.attr('')
    }
  }
}
```

```js
// Post Model
import { Model } from '@vuex-orm/core'
import User from './User'

export default class Post extends Model {
  static entity = 'posts'

  // `this.belongsTo` is for the belongs to relationship.
  static fields () {
    return {
      id: this.attr(null),
      user_id: this.attr(null),
      title: this.attr(''),
      body: this.attr(''),
      published: this.attr(false),
      author: this.belongsTo(User, 'user_id')
    }
  }
}
```

With the above example, we can see that the `author` field at `Post` model has a relation of `belongsTo` with `User` model.

### Register Models to the Vuex Store

Next, it's time to register the models to Vuex. To do so, we first have to register the models to the database and then register the database to Vuex Store as a Vuex plugin using Vuex ORM's `install` method.

```js
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import User from './User'
import Post from './Post'

Vue.use(Vuex)

// Create a new database instance.
const database = new VuexORM.Database()

// Register Models to the database.
database.register(User)
database.register(Post)

// Create Vuex Store and register database through Vuex ORM.
const store = new Vuex.Store({
  plugins: [VuexORM.install(database)]
})

export default store
```

Now we are ready to go. Vuex ORM is going to create `entities` module in Vuex Store. This means there will be a `store.state.entities` state within the store.

### Inserting Records to the Vuex Store

We can use Model's `insert` method, or dispatch a Vuex action to create new records in Vuex Store. Let's say we want to save a single post data to the store.

```js
// Assuming this data structure is the response from the API backend.
const posts = [
  {
    id: 1,
    title: 'Hello, world!',
    body: 'Some awesome body text...',
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
]

Post.insert({ data: posts })

// Or...

store.dispatch('entities/posts/insert', { data: posts })
```

By executing the `insert` method, Vuex ORM creates the following schema in Vuex Store.

```js
// Inside `store.state.entities`.
{
  posts: {
    data: {
      '1': {
        id: 1,
        user_id: 1,
        title: 'Hello, world!',
        body: 'Some awesome body...',
        author: null
      }
    }
  },

  users: {
    data: {
      '1': {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
  }
}
```

See how `posts` and `users` are decoupled from each other. This is what is meant by "normalizing" the data.

### Accessing the Data

Vuex ORM provides a way to query and fetch data in an organized way through Model methods or Vuex Getters.

```js
// Fetch all post records.
Post.all()

// Or...

store.getters['entities/posts/all']()

/*
  [
    {
      id: 1,
      user_id: 1,
      title: 'Hello,
      world!',
      body: 'Some awesome body...',
      author: null
    },
    ...
  ]
*/

// Fetch single record with relation.
Post.query().with('author').first()

// Or...

store.getters['entities/posts/query']().with('author').first()

/*
  {
    id: 1,
    user_id: 1,
    title: 'Hello, world!',
    body: 'Some awesome body...',
    author: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
*/
```

Cool right? To get to know more about Vuex ORM, please [see the documentation](https://vuex-orm.github.io/vuex-orm)

## Plugins

Vuex ORM can be extended via plugins to add additional features. Here is a list of available plugins.

- [Vuex ORM Axios](https://github.com/vuex-orm/plugin-axios) – The plugin to sync the store against a RESTful API.
- [Vuex ORM GraphQL](https://github.com/vuex-orm/plugin-graphql) – The plugin to sync the store against a [GraphQL](https://graphql.org) API.
- [Vuex ORM Search](https://github.com/vuex-orm/plugin-search) – The plugin adds a search() method to filter records using fuzzy search logic from the [Fuse.js](http://fusejs.io).
- [Vuex ORM Change Flags](https://github.com/vuex-orm/plugin-change-flags) - Vuex ORM plugin for adding IsDirty / IsNew flags to model entities.
- [Vuex ORM Soft Delete](https://github.com/vuex-orm/plugin-soft-delete) – Vuex ORM plugin for adding soft delete feature to model entities.

## Resources

- [Vue](https://vuejs.org)
- [Vuex](https://vuex.vuejs.org)

You can find a list of awesome things related to Vuex ORM at [Awesome Vuex ORM](https://github.com/vuex-orm/awesome-vuex-orm).

## Contribution

We are excited that you are interested in contributing to Vuex ORM! Anything from raising an issue, submitting an idea of a new feature, or making a pull request is welcome!

### Development

```bash
$ npm run build
```

Compile files and generate bundles in `dist` directory.

```bash
$ npm run lint
```

Lint files using a rule of Standard JS.

```bash
$ npm run test
```

Run the test using [Jest](https://jestjs.io/).

```bash
$ npm run test:watch
```

Run the test in watch mode.

```bash
$ npm run test:perf
```

Run the performance test.

```bash
$ npm run coverage
```

Generate test coverage in `coverage` directory.

## License

The Vuex ORM is open-sourced software licensed under the [MIT license](LICENSE.md).
