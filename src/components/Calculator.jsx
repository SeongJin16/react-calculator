import * as React from "react";
import styled from "styled-components";

import Panel from "./Panel";
import Display from "./Display";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import History from "./History";

const Container = styled.div`
  margin: 30px auto;
  text-align: center;
`;

// TODO: History 내에서 수식 표시할 때 사용
const Box = styled.div`
  display: inline-block;
  width: 270px;
  height: 65px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  text-align: right;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  h3 {
    margin: 0px;
  }
`;

const evalFunc = function(string) {
  let firstChar = string.substr(0,1);
  if(firstChar=="√") {
    let lapenIndex = string.lastIndexOf(")");
    let subResult = string.substr(2, lapenIndex-2);
    subResult = Math.sqrt(evalFunc(subResult));
    return new Function("return (" + subResult + string.substr(lapenIndex+1,string.length) + ")")();
  }

  return new Function("return (" + string + ")")();
};


class Calculator extends React.Component {
  // TODO: history 추가
  historyCount = 0;
  state = {
    displayValue: "",
    historyList: []
  };

  onClickButton = key => {
    let { displayValue = "" } = this.state;
    let { historyList = [] } = this.state;
    displayValue = "" + displayValue;
    const lastChar = displayValue.substr(displayValue.length - 1);
    const operatorKeys = ["÷", "×", "-", "+"];
    const proc = {
      AC: () => {
        this.setState({ displayValue: "" });
      },
      BS: () => {
        if (displayValue.length > 0) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        this.setState({ displayValue });
      },
      // TODO: 제곱근 구현
      "√": () => {
        const beforeEval = "√(" + displayValue + ")";
        displayValue = displayValue.replace(/×/gi, "*");
        displayValue = displayValue.replace(/÷/gi, "/");
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
          displayValue = evalFunc(displayValue);
          displayValue = Math.sqrt(displayValue);
        }
        const result = { before : beforeEval, after : "= " + displayValue}
        let reverseList = this.state.historyList.reverse();
        reverseList = reverseList.concat(result);
        reverseList = reverseList.reverse()
        this.setState({ displayValue });
        this.setState({ historyList : reverseList });
      },
      // TODO: 사칙연산 구현
      "÷": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "÷" });
        }
      },
      "×": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "×" });
        }
      },
      "-": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "-" });
        }
      },
      "+": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "+" });
        }
      },
      "=": () => {
        const beforeEval = displayValue;
        displayValue = displayValue.replace(/×/gi, "*");
        displayValue = displayValue.replace(/÷/gi, "/");
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        } else if (lastChar !== "") {
          displayValue = evalFunc(displayValue);
        }
        const result = { before : beforeEval, after : "= " + displayValue}
        let reverseList = this.state.historyList.reverse();
        reverseList = reverseList.concat(result);
        reverseList = reverseList.reverse()
        this.setState({ displayValue });
        this.setState({ historyList : reverseList });
      },
      ".": () => {
        let displayTemp = (displayValue + ".");
        let index = -1;
        let count = 0;

        do  {
            index = displayTemp.indexOf('.', index + 1);
            if (index != -1) { count++; }
        } while (index != -1);

        if(count > 1){ this.setState({ displayValue: displayValue}); }
        else { this.setState({ displayValue: displayTemp}); }
      },
      "0": () => {
        if (Number(displayValue) !== 0) {
          displayValue += "0";
          this.setState({ displayValue });
        }
      }
    };

    if (proc[key]) {
      proc[key]();
    } else {
      // 여긴 숫자
      this.setState({ displayValue: displayValue + key });
    }
  };

  onClickBox(data){
    this.setState({ displayValue: data });
  }

  render() {
    const historyList = this.state.historyList;
    return (
      <Container>
        <Panel>
          <Display displayValue={this.state.displayValue} />
          <ButtonGroup onClickButton={this.onClickButton}>
            <Button size={1} color="gray">
              AC
            </Button>
            <Button size={1} color="gray">
              BS
            </Button>
            <Button size={1} color="gray">
              √
            </Button>
            <Button size={1} color="gray">
              ÷
            </Button>

            <Button size={1}>7</Button>
            <Button size={1}>8</Button>
            <Button size={1}>9</Button>
            <Button size={1} color="gray">
              ×
            </Button>

            <Button size={1}>4</Button>
            <Button size={1}>5</Button>
            <Button size={1}>6</Button>
            <Button size={1} color="gray">
              -
            </Button>

            <Button size={1}>1</Button>
            <Button size={1}>2</Button>
            <Button size={1}>3</Button>
            <Button size={1} color="gray">
              +
            </Button>

            <Button size={2}>0</Button>
            <Button size={1}>.</Button>
            <Button size={1} color="gray">
              =
            </Button>
          </ButtonGroup>
        </Panel>
        {/* TODO: History componet를 이용해 map 함수와 Box styled div를 이용해 history 표시 */}
        <History>
          {
            historyList.map((data, index) => (
              <Box key={index}
                onClick={() => {this.onClickBox(data.before);}}>
                <h3>{data.before}</h3>
                <h3>{data.after}</h3>
              </Box>
            ))
          }
        </History>
      </Container>
    );
  }
}

export default Calculator;
