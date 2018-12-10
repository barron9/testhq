import React, { Component } from 'react';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import { message ,List} from 'antd';

const getBooksQuery = gql`
{
  books
  {
    name
    id
    genre
  }
  
}
`
const success = () => {
  const hide = message.loading('yükleniyor..', 100);
  // Dismiss manually and asynchronously
  setTimeout(hide, 2500);
};
class booklist extends Component {

  display(){
    var data = this.props.data
if(data.loading){
//return ()
success()
}else{



  /*
  return data.books.map(book=>{

    return(<li> {book.name} </li> )
  })
  */
 return (

  <List
  size="small"

  bordered={false}
  dataSource={data.books}
  renderItem={item => (<List.Item>{item.name}</List.Item>)}
/>

 )
}


  }
  render() {
    console.log(this.props)
    return (
      <div>
      <ul id="book-list">
      {this.display()}
      </ul>
      
      </div>
      );
    }
  }
  
  export default graphql(getBooksQuery)(booklist);
  