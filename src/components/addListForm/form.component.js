import React from "react";
import "./css/style.css";
import { store } from "react-notifications-component";
import requestPromise from "request-promise";
import DatePicker from "react-date-picker";

class AddListFormComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      displayAddListModal:
        sessionStorage.getItem("displayAddListModal") === "true"
    };
  }
  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
      displayAddListModal:
        sessionStorage.getItem("displayAddListModal") === "true"
    });
  }
  addList = async e => {
    try {
      e.preventDefault();
      await requestPromise({
        method: "POST",
        uri: "http://127.0.0.1:3002/api/list",
        headers: {
          Authorization: `Bearer ${this.props.token}`
        },
        body: {
          name: this.state.name,
        },
        json: true
      });
      store.addNotification({
        title: "Add list",
        message: "Список успешно создан",
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
        sessionStorage.setItem("displayAddListModal", false);
        window.location.reload();
      }, 1000);
    } catch (err) {
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
  render() {
    return (
      <div
        id="myModal"
        class="modal"
        style={{ display: this.state.displayAddListModal ? "block" : "none" }}
      >
        <div class="form-list">
          <p class="new-item_header">ADD NEW ITEM</p>
          <form action="" method="POST">
            <label class="add-item name-form-list">
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
            <input
              type="submit"
              id="add-list"
              class="form-input"
              value="Add"
              onClick={this.addList}
            />
            <button
              id="cancel-list"
              onClick={e => {
                e.preventDefault();
                this.setState({ displayAddListModal: false });
                sessionStorage.setItem("displayAddListModal", false);
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
export default AddListFormComponent;
