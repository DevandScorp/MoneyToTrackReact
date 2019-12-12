import React from "react";
import "./css/style.css";
import './css/checkbox.css';
import { store } from "react-notifications-component";
import requestPromise from "request-promise";
import DatePicker from "react-date-picker";
import { catchClause, thisTypeAnnotation, conditionalExpression } from "@babel/types";

class AddItemFormComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      listName: "",
      name: "",
      details: "",
      amount: 0,
      selectedOption: 'income',
      date: new Date(),
      displayAddItemModal:
        sessionStorage.getItem("displayAddItemModal") === "true"
    };
  }
  onDateChange = date => {
    console.log(date);
    this.setState({ date });
  };
  handleInputChange = event => {
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };
  handleOptionChange = event => {
    this.setState({
      selectedOption: event.target.value
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      ...nextProps,
      displayAddItemModal:
        sessionStorage.getItem("displayAddItemModal") === "true"
    });
    if(!this.state.listName && nextProps.lists) {
      this.setState({ listName: nextProps.lists[0].name});
    }
    
  }
  addItem = async e => {
    try {
      e.preventDefault();
      console.log(this.state);
      const [foundList] = this.props.lists.filter(
        list => list.name === this.state.listName
      );
      console.log(foundList);
      if (!foundList) throw "Список не найден";
      await requestPromise({
        method: "POST",
        uri: "http://127.0.0.1:3002/api/list/item",
        headers: {
          Authorization: `Bearer ${this.props.token}`
        },
        body: {
          list_id: foundList.id,
          amount: Math.abs(this.state.amount),
          type: this.state.selectedOption === 'income' ? 0 : 1,
          name: this.state.name,
          description: this.state.details,
          date: this.state.date
        },
        json: true
      });
      store.addNotification({
        title: "Add list item",
        message: "Элемент успешно добавлен",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 500,
          onScreen: false
        }
      });
      setTimeout(() => {
        sessionStorage.setItem("displayAddItemModal", false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.log(err);
      store.addNotification({
        title: "Add list",
        message: err.message ? err.message : err,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 500,
          onScreen: false
        }
      });
    }
  };
  handleSelect = (e) => {
    this.setState({ listName: e.target.value });
  }
  render() {
    return (
      <div
        id="myModal"
        class="modal"
        style={{ display: this.state.displayAddItemModal ? "block" : "none" }}
      >
        <div class="form">
          <p class="new-item_header">ADD NEW ITEM</p>
          <form action="" method="POST">
            <label class="add-item name-form">
              Name
              <input
                id="name-form"
                name="name"
                class="form-input"
                value={this.state.name}
                onChange={this.handleInputChange}
                type="text"
              />{" "}
            </label>
            <label class="add-item list-form">
              List
              <select className="add-item-select" value={this.state.listName} onChange={this.handleSelect}>
                {(this.props.lists || this.state.lists ?
                  this.props.lists || this.state.lists :
                  []).map((list) => (<option value={list.name}>{list.name}</option>))}
              </select>
            </label>
            <label class="add-item amount-form">
              Amount
              <label class="container" style={{
                  marginLeft: '30px'
                }}>Income
                <input type="radio"
                  value='income'
                  onChange={this.handleOptionChange}
                  checked={this.state.selectedOption === 'income'}
                  name="radio" />
                <span class="checkmark"></span>
              </label>
              <label class="container">Expense
                <input type="radio"
                  name="radio"
                  onChange={this.handleOptionChange}
                  value='expense'
                  checked={this.state.selectedOption === 'expense'} />
                <span class="checkmark"></span>
              </label>
              <input
                id="amount-form"
                name="amount"
                class="form-input"
                style={{
                  left: '50px',
                  marginLeft: '90px'
                }}
                value={this.state.amount}
                onChange={this.handleInputChange}
                type="text"
              />{" "}
            </label>
            <span class="add-item date_label">Date</span>
            <div class="date-form">
              <DatePicker
                className="default"
                onChange={this.onDateChange}
                value={this.state.date}
              />
            </div>
            <label class="add-item details-form">
              Details
              <textarea
                id="details-form"
                name="details"
                value={this.state.details}
                onChange={this.handleInputChange}
                class="form-input"
              ></textarea>
            </label>
            <input
              type="submit"
              id="add"
              class="form-input"
              value="Add"
              onClick={this.addItem}
            />
            <button
              id="cancel"
              onClick={e => {
                e.preventDefault();
                this.setState({ displayAddItemModal: false });
                sessionStorage.setItem("displayAddItemModal", false);
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }
}
export default AddItemFormComponent;
