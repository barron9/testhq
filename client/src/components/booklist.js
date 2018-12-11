import React, { Component } from 'react';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import { message ,List,Icon} from 'antd';

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
  bordered={true}
  dataSource={data.books}
  renderItem={item => (<List.Item onClick={()=>{
    if(item.genre==='uncompleted'){
    this.props.client.mutate({
      mutation: gql`mutation{
        completeBook(_id:"${this.props.mongoose.Types.ObjectId(item.id)}",genre:"completed",authorid:"a"){
          name
        }
      }`,
      
    });
  }
  else{
    this.props.client.mutate({
      mutation: gql`mutation{
        uncompleteBook(_id:"${this.props.mongoose.Types.ObjectId(item.id)}",genre:"uncompleted",authorid:"a"){
          name
        }
      }`,
      
    });

  }

  }}> 
 <Icon type="check-circle" style={{marginRight:5,fontSize:20,color:item.genre==='completed'?'green':'#ddd'}} theme={'outlined'} />
  {item.name} </List.Item>)}
/>

 )
}


  }
  render() {
    console.log(this.props)
    return (
      <div>
      {this.display()}
      
      
      </div>
      );
    }
  }
  
  export default graphql(getBooksQuery)(booklist);
  