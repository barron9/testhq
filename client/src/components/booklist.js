import React, { Component } from 'react';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import { message ,List,Icon,Button} from 'antd';

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
let succ = message.loading('yükleniyor..', null);

const success = () => {
  const succ = message.loading('yükleniyor..', null);
  // Dismiss manually and asynchronously
  //setTimeout(hide, 2500);
};
class booklist extends Component {

  display(){
    var data = this.props.data
if(data.loading){
//return ()
//success()
succ()
}else{

succ=null

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
  renderItem={item => (<List.Item><div className={item.genre == 'completed'?"item":null}
    onClick={()=>{
    if(item.genre==='uncompleted'){
    this.props.client.mutate({
      mutation: gql`mutation{
        completeBook(id:"${item.id}",genre:"completed",authorid:"a"){
          name
        }
      }`,
      
    });
  }
  else{
    this.props.client.mutate({
      mutation: gql`mutation{
        uncompleteBook(id:"${item.id}",genre:"uncompleted",authorid:"a"){
          name
        }
      }`,
      
    });

  }

  }}> 
 <Button  shape="circle"  icon="check" onClick={()=>{
       //alert(item.id)

    if(item.genre==='uncompleted'){
    this.props.client.mutate({
      mutation: gql`mutation{
        completeBook(id:"${this.props.mongoose.Types.ObjectId(item.id)}",genre:"completed",authorid:"a"){
          name
        }
      }`,
      
    });
  }
  else{
    this.props.client.mutate({
      mutation: gql`mutation{
        uncompleteBook(id:"${this.props.mongoose.Types.ObjectId(item.id)}",genre:"uncompleted",authorid:"a"){
          name
        }
      }`,
      
    });

  }

  }}
  style={{marginRight:5,fontSize:20,backgroundColor:item.genre==='completed'?'#89ba16':'white',color:'#ddd'}} theme={'outlined'} />
  {item.name} </div></List.Item>)}
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
  