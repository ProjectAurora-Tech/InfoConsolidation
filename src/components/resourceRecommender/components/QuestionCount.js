import React from "react";
import { Progress } from "semantic-ui-react";

function QuestionCount(props) {
  return (
    <div>
      <Progress
        percent={((props.counter - 1) / props.total) * 100}
        indicating
      />
    </div>
  );
}
export default QuestionCount;
