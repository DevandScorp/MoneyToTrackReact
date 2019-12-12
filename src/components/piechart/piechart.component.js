import React from "react";
import "./css/style.css";
import { store } from "react-notifications-component";
import requestPromise from "request-promise";
import { Doughnut } from 'react-chartjs-2';
import moment from 'moment';
import exitGreen from './images/cross-green.png';
import exitWhite from './images/cross-white.png';
const data = {
  labels: [
    'Red',
    'Green',
  ],
  datasets: [{
    data: [1, 1],
    backgroundColor: [
      '#FF6384',
      '#36A2EB'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB'
    ]
  }]
};

class ShowPiechartComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      income: 0,
      expense: 0,
      noDataFound: false,
      data: {
        labels: [
          'Incomes',
          'Expenses',
        ],
        datasets: [{
          data: [50, 50],
          backgroundColor: [
            '#5fed85',
            '#e04c4c'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB'
          ]
        }]
      },
      displayPiechart:
        sessionStorage.getItem("displayPiechart") === "true"
    };
  }
  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  async componentWillReceiveProps(nextProps) {
    console.log(nextProps);
      try {
        const totalData = await requestPromise({
          uri: "http://127.0.0.1:3002/api/list/period/total",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.state.token ||
              this.props.token}`
          },
          qs: {
            dateFrom: moment(nextProps.dateFrom).format("DD.MM.YYYY"),
            dateTo: moment(nextProps.dateTo).format("DD.MM.YYYY")
          },
          json: true // Automatically parses the JSON string in the response
        });
        console.log('Сделали запрос')
        console.log(nextProps.dateFrom, nextProps.dateTo, totalData)
        if (totalData.income === 0 && totalData.expense === 0) {
          console.log('Данные из запроса нулевые');
          this.setState({ noDataFound: true });
        } else {
          console.log('Данные из запроса ненулевые');
          this.setState({ noDataFound: false });
          this.setState({
            data: {
              labels: [
                'Incomes',
                'Expenses',
              ],
              datasets: [{
                data: [totalData.income, totalData.expense],
                backgroundColor: [
                  '#5fed85',
                  '#e04c4c'
                ],
                hoverBackgroundColor: [
                  '#8ef5a9',
                  '#ed8080'
                ]
              }]
            }
          });
        }

      } catch (err) {
        store.addNotification({
          title: "Main Page",
          message: err.message,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 1000,
            onScreen: false
          }
        });
      }
    this.setState({
      displayPiechart:
        sessionStorage.getItem("displayPiechart") === "true"
    });
  }
  changeImage = (id, changeImage) => {
    document.getElementById('exit-icon').src = changeImage
      ? exitGreen
      : exitWhite;

  };
  render() {
    if (this.state.noDataFound && !this.state.income && !this.state.expense) {
      return (
        <div
          id="myModal"
          class="modal"
          style={{
            display: this.state.displayPiechart ? "block" : "none",
          }}
        >
          <div className="exit">
            <img id="exit-icon"
              onMouseOver={() => this.changeImage('exit-icon', true)}
              onMouseLeave={() => this.changeImage('exit-icon', false)}
              onClick={() => {
                sessionStorage.setItem('displayPiechart', false);
                this.setState({ displayPiechart: false, noDataFound: false });
              }}
              src={exitWhite} />

          </div>
          <div
            className='piechart-text'
          >
            No data to show
        </div>

        </div>
      )
    }
    return (
      <div
        id="myModal"
        class="modal"
        style={{
          display: this.state.displayPiechart ? "block" : "none",
        }}
      >
        <div
          style={{
            maxWidth: '1300px',
            maxHeight: '1300px',
            marginLeft: '20%',
            marginTop: '1%'
          }}
        >
          <div className="exit">
            <img id="exit-icon"
              onMouseOver={() => this.changeImage('exit-icon', true)}
              onMouseLeave={() => this.changeImage('exit-icon', false)}
              onClick={() => {
                sessionStorage.setItem('displayPiechart', false);
                this.setState({ displayPiechart: false, noDataFound: false });
              }}
              src={exitWhite} />
          </div>
          <Doughnut
            data={this.state.data}
          />
        </div>

      </div>
    );
  }
}
export default ShowPiechartComponent;
