const typeDefs = `#graphql

  enum TaskStatus {
    PENDING
    DONE
  }

  enum UrgencyLevel {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type TaskStats {
    total: Int!
    pending: Int!
    done: Int!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    deadline: String!
    urgency: UrgencyLevel!
    status: TaskStatus!
    owner: User!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    deadline: String!
    urgency: UrgencyLevel! = MEDIUM
  }

  input UpdateTaskInput {
    title: String
    description: String
    deadline: String
    urgency: UrgencyLevel
    status: TaskStatus
  }

  input TaskFilterInput {
    status: TaskStatus
    urgency: UrgencyLevel
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    tasks(filters: TaskFilterInput): [Task!]!
    task(id: ID!): Task
    taskStats: TaskStats!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    markTaskAsCompleted(id: ID!): Task!
    markTaskAsPending(id: ID!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;

