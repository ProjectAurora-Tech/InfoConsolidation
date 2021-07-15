import "./ResourceRecommender.css";

import React, { Component } from "react";

import Quiz from "./components/Quiz";
import QuizResultCard from "./components/QuizResultCard";
import Resources from "../../static/Resources";
import Tags from "../../static/Tags";
import _ from "underscore";
import quizQuestions from "./api/quizQuestions";

class ResourceRecommender extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: -1,
      questionId: 1,
      question: "",
      answerOptions: [],
      answer: "",
      answersCount: {},
      result: "",
      //   previousAnswer: {},
      flag: 0,
      selected: false,
      answerLists: [],

      // adding this.state.filter function for the quizapp to return filtered results
      filter: _.reduce(
        Tags.getCategories(),
        (obj, category) => {
          obj[category] = [];
          return obj;
        },
        {}
      ),
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.setPreviousQuestion = this.setPreviousQuestion.bind(this);
    // this.setNextQuestion = this.setNextQuestion.bind(this);
  }

  componentDidMount() {
    const staticAnswerOptions = quizQuestions.map(
      (question) => question.answers
    );
    this.setState({
      question: quizQuestions[0].question,
      answerOptions: staticAnswerOptions[0],
    });
  }

  backFromResult = () => {
    this.setState({
      result: "",
      flag: 0,
    });
  };

  handleClick = () => {
    this.setState({ counter: 0 });
  };

  resetForm = () => {
    this.setState(
      {
        counter: 0,
        questionId: 1,
        question: "",
        answerOptions: [],
        answer: "",
        answersCount: {},
        result: "",
        //   previousAnswer: {},
        flag: 0,
        selected: false,
        answerLists: [],

        // adding this.state.filter function
        filter: _.reduce(
          Tags.getCategories(),
          (obj, category) => {
            obj[category] = [];
            return obj;
          },
          {}
        ),
      },
      () => {
        this.componentDidMount();
      }
    );
  };

  handleAnswerSelected(e, answer) {
    //console.log("E.TARGET.VALUE: " + e.target.value);
    //console.log("answer passed was : " + answer);

    if (e.target.value !== undefined) {
      this.setUserAnswer(e.target.value); // means the input value (AnswerOption.js)

      if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setFinalResults(), 300);
      }
    } else {
      this.setUserAnswer(answer);
      if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setFinalResults(), 300);
      }
    }
  }

  setUserAnswer(answer) {
    this.setState(
      (state) => ({
        answersCount: {
          ...state.answersCount,
          [answer]: (state.answersCount[answer] || 0) + 1,
          previousAnswerCount: this.state.answersCount,
        },

        answer: answer,
        selected: true,
      }),
      () => {
        // console.log(this.state);
      }
    );
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;
    let answerList = this.state.answerLists;
    answerList[this.state.counter] = this.state.answer;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      answerOptions: quizQuestions[counter].answers,
      // answer: "",
      answer:
        this.state.answerLists[this.state.counter + 1] !== undefined
          ? this.state.answerLists[this.state.counter + 1]
          : "",
      //  previousAnswer:{answerText: this.state.answer,
      //   previousAnswer:this.state.previousAnswer
      // },
      selected: true,
      answerLists: answerList,
    });
    //console.log(this.state);
  }

  setPreviousQuestion() {
    const counter = this.state.counter - 1;
    const questionId = this.state.questionId - 1;
    const previousanswer = this.state.answerLists[this.state.counter - 1];

    this.setState(
      {
        counter: counter,
        questionId: questionId,
        question: quizQuestions[counter].question,
        answerOptions: quizQuestions[counter].answers,
        answer: previousanswer,
        selected: false,
        answersCount: this.state.answersCount.previousAnswerCount,
        // previousAnswer: this.state.previousAnswer.previousAnswer,
      },
      () => {
        //console.log(this.state);
      }
    );
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount).sort(function (a, b) {
      return answersCount[b] - answersCount[a];
    });

    const filterResult = answersCountKeys.filter(
      (x) => x !== "previousAnswerCount"
    );

    return filterResult;
  }
  // return array of filtered tags

  setResults(result) {
    let answerList = this.state.answerLists;
    answerList[this.state.counter] = this.state.answer;
    if (result.length !== 0) {
      this.setState({
        result: result,
        flag: 1,
        answerLists: answerList,
      }); // set result to result array
    } else {
      this.setState({ result: "Undetermined", flag: 1 });
    }
  }

  setFinalResults() {
    let answerList = this.state.answerLists;
    answerList[this.state.counter] = this.state.answer;

    if (this.state.answerLists.length !== 0) {
      answerList = answerList.map((tag) =>
        tag.includes("Dup") ? tag.replace("Dup", "") : tag
      );

      this.setState({
        result: answerList,
        flag: 1,
        answerLists: answerList,
      }); // set result to result array
    } else {
      this.setState({ result: "Undetermined", flag: 1 });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
        doneFlag={this.state.flag}
        counter={this.state.counter}
        setPreviousQuestion={this.setPreviousQuestion}
        selected={this.selected}
        answerLists={this.state.answerLists}
        handleClick={this.handleClick}
      />
    );
  }

  renderResult() {
    return (
      <>
        <QuizResultCard
          resources={Resources}
          filter={this.state.filter}
          quizResult={this.state.result}
          backFromResult={this.backFromResult}
          resetForm={this.resetForm}
          // result is an array of tags
        />
        {/*<button onClick={this.resetForm}> reset </button>
        <button onClick={this.backFromResult}> go back </button>*/}
      </>
    );
  }

  render() {
    return (
      <div className="App">
        {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }
}

export default ResourceRecommender;
