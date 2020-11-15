import { Component } from "react";
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
     
    this.state = {
       current: "0",
       formula: "",
       result: ""
    }

    this.clear = this.clear.bind(this);
    this.input = this.input.bind(this);
    this.inputNumber = this.inputNumber.bind(this);
    this.inputOperation = this.inputOperation.bind(this);
    this.inputPoint = this.inputPoint.bind(this);
    this.cal = this.cal.bind(this);
  }

  clear(){
    this.setState({current: "0", formula: "", result: ""});
  }

  input(val){
     /^\d+$/g.test(val)? this.inputNumber(val) : this.inputOperation(val);
  }

  inputNumber(number){
     this.setState(state => {
      let current = `${state.current}`;
      let formula = state.formula;

      formula = state.result? number : current === "0" && number === "0"? "0" : formula + number;
      current = state.result? number : current === "0" && number === "0"? "0" : current === "0"? number : current + number;
      current = current.replace(/[^\d.]/g, "");

      return {
        current,
        formula,
        result: ""
      }
     });
  }

  inputOperation(sign){
     this.setState(state => {
      let current = state.current;
      let formula = state.formula;
      let result = state.result;
      if(formula){
        if("x+/".includes(formula[formula.length - 1]) && sign === "-"){
            formula += sign;
            current = sign; 
        }else if("x+/".includes(sign) && "x+/".includes(formula[formula.length - 1])){
             formula = formula.substring(0, formula.length - 1) + sign;
             current = sign;
        }
        else if((formula[formula.length - 1] === "-" && "x+/-".includes(formula[formula.length - 2]))){
             if("x+/".includes(sign)){
               formula = formula.substring(0, formula.length-2) + sign;
               current = sign;
             }
        }
        else {
          formula = result? result + sign: formula + sign;
          current = sign;
        }
      }
      return {current, formula, result: ""}
     });
  }

  inputPoint(){
    console.log("Junior");
     this.setState(state => {
        let current = state.current;
        let formula = state.formula;
        let result = state.result;

        if(!current.includes(".")){
           formula = result? "0." : formula? "-+/x".includes(formula[formula.length-1])? formula + "0." : formula + "." : "0.";
           current = result? "0." : current === "0"? "0." : "-+/x".includes(current)? "0." : current + ".";
           result = "";
        }
        return {current, formula, result};
     });
  }

  cal(){
    this.setState(state =>{
         let formula = state.formula.replace(/^[^\d\-]+|[^\d\.]+$/g, "");
         let result = calcular(formula);
         return { result, current: result, formula: `${state.formula}=${result}` };
    });
  }

  render(){
    return (
      <div className="App">
        <div className="bar"></div>
        <div className="screen">
             <div className="formula">{this.state.formula}</div>
             <div className="display" id="display">{this.state.current}</div>
        </div>
        <div className="grid-container">
            <Button id="clear" onClick={this.clear} value="AC"/>
            <Button id="divide" onClick={()=>{this.input("/")}} value="/"/>
            <Button id="multiply" onClick={()=>{this.input("x")}} value="x"/>
            <Button id="seven" onClick={()=>{this.input("7")}} value="7"/>
            <Button id="eight" onClick={()=>{this.input("8")}} value="8"/>
            <Button id="nine" onClick={()=>{this.input("9")}} value="9"/>
            <Button id="subtract" onClick={()=>{this.input("-")}} value="-"/>
            <Button id="four" onClick={()=>{this.input("4")}} value="4"/>
            <Button id="five" onClick={()=>{this.input("5")}} value="5"/>
            <Button id="six" onClick={()=>{this.input("6")}} value="6"/>
            <Button id="add" onClick={()=>{this.input("+")}} value="+"/>
            <Button id="one" onClick={()=>{this.input("1")}} value="1"/>
            <Button id="two" onClick={()=>{this.input("2")}} value="2"/>
            <Button id="three" onClick={()=>{this.input("3")}} value="3"/>
            <Button id="equals" onClick={()=>{this.cal()}} value="="/>
            <Button id="zero" onClick={()=>{this.input("0")}} value="0"/>
            <Button id="decimal" onClick={()=>{this.inputPoint()}} value="."/>
        </div>
      </div>
    );
  }
 
}

const Button = (props) =>{
   return (
   <button 
          id = {props.id}
          onClick = {props.onClick}>{props.value}</button>
   );
}

const calcular = f => {
  f = f.replace(/\s/g,"");
  const OPERACIONES = ["/", "x", "-","+"];
  for(let i = 0; i < OPERACIONES.length; i++){ 
    let sign = OPERACIONES[i];
    while(!/^\-?\d+\.?\d*$/g.test(f) && f.indexOf(sign) >= 0){
        let patron = `(?<=[+-/x])\\-\\d+\\.?\\d*\\${sign}\\-?\\d+\\.?\\d*|\\-?\\d+\\.?\\d*\\${sign}\\-?\\d+\\.?\\d*`;
        patron = new RegExp(patron);
        let operando = f.match(patron);
        if(operando === null){
          break;
        }
        operando = operando[0];
        let index = f.indexOf(operando);
        let left = f.substring(0, index);
        let rigth = f.substring(`${left}${operando}`.length);
        let result = "";
        let n1 = "";
        let n2 = "";
        if(sign !== "-"){
          index = operando.indexOf(sign);
        }else{
          index = operando.indexOf(sign);
          index = index === 0? operando.indexOf(sign,1) : index; 
        }
        n1 = operando.substring(0,index);
        n2 = operando.substring(index+1);
        n1 = /\./.test(n1)? parseFloat(n1) : parseInt(n1);
        n2 = /\./.test(n2)? parseFloat(n2) : parseInt(n2);
        result = `${operar(n1, n2, sign)}`;
        f = left + result + rigth; 
    }  
  }
 return f;
}

const operar = (n1, n2, sig) => {
   switch(sig){
     case "x" : return n1 * n2;
     case "/" : return n1 / n2;
     case "-" : return n1 - n2;
     case "+" : return n1 + n2;
     default : return undefined;
   }
}

export default App;
