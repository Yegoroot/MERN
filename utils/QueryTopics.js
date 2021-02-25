import Query from './Query.js'

class QueryTopics extends Query {
  constructor(query, model, user) {
    super(query, model, user)
  }

  populate() {
    this.request.populate([
      { path: 'program', select: 'title description' },
      { path: 'user', select: 'name email' },
    ])
  }
}

export default QueryTopics
