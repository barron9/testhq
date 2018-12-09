const express = require('express');
const graphqlHTTP = require('express-graphql');
//const schema = require('./schema/schema');
const app = express();
//const MyGraphQLSchema = new GraphQLSchema({query: GraphQLRoot});

const graphql = require('graphql')
const _ = require('lodash')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID , GraphQLList} = graphql

var Chance = require('chance');
var chance = new Chance();

var books, authors
//dmmy data
for (var i = 0; i < 10; i++) {
  books = _.concat(books, { name: chance.first() + ' ' 
  + chance.last(), genre: chance.animal(), id: i.toString() ,authorid:i.toString()});
}
for (var i = 0; i < 10; i++) {
  authors = _.concat(authors, { name: chance.first() + ' ' 
  + chance.last(), age: chance.age(), id: i.toString() });
}

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author:{
      type:AuthorType,
      resolve(parent,args){
        return _.find(authors,{id:parent.authorid})
        
      }
      
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent,args){
        return _.filter(books,{authorid:parent.id})
        
      }
      
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        ///code to get data from db
        return _.find(books, { id: args.id })
        
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        ///code to get data from db
        return _.find(authors, { id: args.id })
        
      }
    },
  }
})

const schema = new GraphQLSchema({
  query: RootQuery
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(4000);

/* api/graphql command
{
  author(id: 5) {
    name
    age
    id
    books {
      id
      name
    }
    
  },
   book(id: 5) {
    name
    genre
    id
    author{
      name
      age
      id
    }
    
    
  },
 
}

*/