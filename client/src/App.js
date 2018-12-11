import React, { Component } from 'react';
import './index.css'
import { Column, Row } from 'simple-flexbox';
import { message, Button,Steps,Layout,Input,Progress } from 'antd';

//components 
import Booklist from './components/booklist'

//apollo
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
const mongoose = require('mongoose');

const client = new ApolloClient({
  uri:'https://promoclubserver.now.sh/graphql'
})
const {
  Header, Footer, Sider, Content,
} = Layout;
const Step = Steps.Step;

class App extends Component {
  state={
    initial:0,
    percent:0
    
  }
  
  render() {
    var a 
    return (
      <ApolloProvider client={client}>


      <div className="App" >
      <Row horizontal='center' vertical='center' style={{paddingTop:10,marginTop:10,background:'#eee',borderRadius:10,marginBottom:5}}> 
      
      
      <h3 style={{color:'#ccc'}}>PromoClub Mobil Uygulaması Hata Ayıklama</h3>
      </Row>
      {false&&
      <Steps size="small" current={this.state.initial}>
      <Step title="Yeni Hata/İstek" />
      <Step title="İşlem Yapılıyor" />
      <Step title="Hata İletildi" />
      </Steps>}
      {this.state.initial==0&&
        <Column>
        <Row horizontal='center' vertical='center' style={{padding:10,background:'#eee',borderRadius:10,marginBottom:5 }}> 
        
        <Input placeholder="Hata veya aksaklık giriniz..." size={"large"} style={{margin:10}} value={this.state.hata} onChange={
         (e) => {
          this.setState({hata: e.target.value})
        }
      }
          />
        <Button type="primary" shape="circle" icon="check" disabled={this.state.disable} onClick={()=>
          {if(this.state.hata=='undefined' ||typeof this.state.hata == undefined || this.state.hata=='' || !this.state.hata){
            const hide = message.error('lütfen açıklama belirtiniz!', 100);
            // Dismiss manually and asynchronously
            setTimeout(hide, 2500);
            
            return}
            this.setState({disable:true})
            client.mutate({
              mutation: gql`mutation{
                addBook(name:"${this.state.hata}",genre:"uncompleted",authorid:"a"){
                  name
                }
              }`,
              
            });
            var self = this;
            
            self.intv = setInterval(function(){
              if(self.state.initial == 2)return
              self.setState({initial:1,percent:self.state.percent+18})
              if(self.state.percent>99){
                
                self.setState({initial:2})
                clearInterval(self.intv);

              }
            },1000)
            
            
            
          }
          
        } />
        </Row>
        <Booklist client={client} mongoose={mongoose}/>  

        </Column>
      }
      {this.state.initial==1&&
        <Row horizontal='center' vertical='center' style={{marginTop:50}}> 
        <Progress type="circle" percent={this.state.percent} />
        
        </Row>
      }
      {this.state.initial==2&&
        <Column horizontal='center' vertical='center' style={{marginTop:50}}> 
        <Progress type="circle" percent={this.state.percent} />
        <h2>Hata iletildi, Teşekkürler</h2>
        <Button onClick={()=>window.location.reload()}>Tekrar</Button>
        </Column>
      }
      {false&&
        <Booklist/>  
      }
      </div>
      
      
      
      
      </ApolloProvider>
      );
    }
  }
  
  export default App;
  