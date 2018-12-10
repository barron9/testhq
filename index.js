const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const app = express();

//mongoose 

mongoose.connect('mongodb://test:000000a@ds127704.mlab.com:27704/hatarapor',{ useNewUrlParser: true })
mongoose.connection.once('open',()=>console.log('vt baglandi'))
const mschema = mongoose.Schema
const bookschema = new mschema({
  name:String,
  genre:String,
  authorid:String
})
const Book = mongoose.model('Book',bookschema) // module.exports ...
const authorschema = new mschema({
  name:String,
  age:Number,
})
const Author = mongoose.model('Author',authorschema)// module.exports ...
//const schema = require('./schema/schema');
//const MyGraphQLSchema = new GraphQLSchema({query: GraphQLRoot});

const graphql = require('graphql')
const _ = require('lodash')
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID , GraphQLList} = graphql
/*
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
*/

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author:{
      type:AuthorType,
      resolve(parent,args){
        //return _.find(authors,{id:parent.authorid})
        return Author.findById(parent.authorid)
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
        //return _.filter(books,{authorid:parent.id})
        return Book.find({authorid:parent.authorid})
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
        //return _.find(books, { id: args.id })
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        ///code to get data from db
        //return _.find(authors, { id: args.id })
        return Author.findById(args.id)
      }
    },
    books:{
      type: new GraphQLList(BookType),
      resolve(parent,args){
        //return _.filter(books)
        return Book.find({})
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent,args){
        //return _.filter(books)
        return Author.find({})
      }      
    }
  }
})

const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addAuthor:{
      type:AuthorType,
      args:{
        name:{type:GraphQLString},
        age:{type:GraphQLInt}
      },
      resolve (parent,args){
        let author = new Author({
          name:args.name,
          age:args.age
        })
        return author.save()
        
      }
    },
    addBook:{
      type:BookType,
      args:{
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        authorid:{type:GraphQLID}
      },
      resolve(parent,args){
        let book = new Book({
          name:args.name,
          genre:args.genre,
          authorid:args.authorid
        })
        return book.save()
      }

    }
    
  }
  
  
  
})
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation:Mutation
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
  books {
    id
    name
    genre
    author {
      id
      name
      age
    }
    
  }
  
}
///////
mutation request

mutation{
  
  addAuthor(name:"a",age:22) {
    id
  }
}
*/