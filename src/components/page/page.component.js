import React from "react";
import "./css/style.css";
import requestPromise from "request-promise";
import { store } from "react-notifications-component";
import axios from 'axios';
import ShowPiechartComponent from '../piechart/piechart.component';
import DatePicker from "react-date-picker";
import moment from "moment";
import AddItemFormComponent from "../addItemForm/form.component";
import AddListFormComponent from "../addListForm/form.component";
import busket from "./images/garbage.png";
import busketDelete from "./images/garbage-delete.png";
import logoutWhite from './images/logout_white.png';
import logoutGreen from './images/logout_green.png';
import "./css/dropdown.css";
import "./css/tooltips.css";

class PageComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      dateFrom: new Date(),
      dateTo: new Date(),
      items: [],
      displayAddItemModal: false,
      displayAddListModal: false,
      displayPiechart: false,
      totalAmount: 0,
      totalIncomes: 0,
      totalExpences: 0,
      chosenItemId: 0,
      currentListId: 0,
      showDropdown: false
    };
    document.onkeydown = (evt) => {
      evt = evt || window.event;
      let isEscape = false;
      if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
        isEscape = (evt.keyCode === 27);
      }
      if (isEscape) {
        sessionStorage.setItem('displayPiechart', false);
        this.setState({ displayPiechart: false });
      }
    };
  }
  setListItems = async (id, name) => {
    try {
      const items = await requestPromise({
        uri: "http://127.0.0.1:3002/api/list",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        qs: { id },
        json: true // Automatically parses the JSON string in the response
      });
      this.setState({ currentListId: id, currentListName: name });
      this.setState({ items: items.list_items });
    } catch (err) {
      if (err.statusCode === 401) {
        await this.refreshToken();
        const items = await requestPromise({
          uri: "http://127.0.0.1:3002/api/list",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.state.token ||
              this.props.location.state.token}`
          },
          qs: { id },
          json: true // Automatically parses the JSON string in the response
        });
        this.setState({ currentListId: id, currentListName: name });
        this.setState({ items: items.list_items });
      } else {
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

    }
  };
  setAllItems = async () => {
    try {
      const lists = await requestPromise({
        uri: "http://127.0.0.1:3002/api/list/item",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        json: true // Automatically parses the JSON string in the response
      });
      console.log(lists);
      const items = lists.reduce((acc, item) => {
        acc.push(...item.list_items)
        return acc;
      }, [])
      this.setState({ items });
    } catch (err) {
      if (err.statusCode === 401) {
        await this.refreshToken();
        try {
          const lists = await requestPromise({
            uri: "http://127.0.0.1:3002/api/list/item",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token ||
                this.props.location.state.token}`
            },
            json: true // Automatically parses the JSON string in the response
          });
          console.log(lists);
          const items = lists.reduce((acc, item) => {
            acc.push(...item.list_items)
            return acc;
          }, [])
          this.setState({ items });
        } catch (errSecond) {
          store.addNotification({
            title: "Main Page",
            message: errSecond.message,
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
      } else {
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

    }
  };
  onDateFromChange = dateFrom => this.setState({ dateFrom });
  onDateToChange = dateTo => this.setState({ dateTo });
  calculateAmount = async () => {
    try {
      const totalData = await requestPromise({
        uri: "http://127.0.0.1:3002/api/list/period/total",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        qs: {
          dateFrom: moment(this.state.dateFrom).format("DD.MM.YYYY"),
          dateTo: moment(this.state.dateTo).format("DD.MM.YYYY")
        },
        json: true // Automatically parses the JSON string in the response
      });
      this.setState({
        totalIncomes: totalData.income,
        totalExpences: totalData.expense
      });
    } catch (err) {
      if (err.statusCode === 401) {
        await this.refreshToken();
        try {
          const totalData = await requestPromise({
            uri: "http://127.0.0.1:3002/api/list/period/total",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token ||
                this.props.location.state.token}`
            },
            qs: {
              dateFrom: moment(this.state.dateFrom).format("DD.MM.YYYY"),
              dateTo: moment(this.state.dateTo).format("DD.MM.YYYY")
            },
            json: true // Automatically parses the JSON string in the response
          });
          this.setState({
            totalIncomes: totalData.income,
            totalExpences: totalData.expense
          });
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
      } else {
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

    }
  };
  async componentDidMount() {
    document.querySelectorAll(".react-date-picker__wrapper").forEach(doc => {
      doc.style = "border: none";
    });
    document
      .querySelectorAll("div.react-date-picker__inputGroup")
      .forEach(doc => {
        doc.children[1].style = "color: white;";
        doc.children[2].style = "color: white;";
        doc.children[3].style = "color: white;";
        doc.children[4].style = "color: white;";
        doc.children[5].style = "color: white;";
      });
    document
      .querySelectorAll(".react-date-picker__calendar-button__icon")
      .forEach(svg => {
        svg.style.stroke = "white";
      });
    document
      .querySelectorAll(".react-date-picker__clear-button__icon")
      .forEach(svg => {
        svg.style.stroke = "white";
      });
    this.setState(this.props.location.state);
    /**
     * Списки без элементов
     */
    try {
      const lists = await requestPromise({
        uri: "http://127.0.0.1:3002/api/list",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        json: true // Automatically parses the JSON string in the response
      });
      this.setState({ lists });

      const totalAmount = await requestPromise({
        uri: "http://127.0.0.1:3002/api/list/total",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        json: true // Automatically parses the JSON string in the response
      });
      this.setState({ totalAmount: totalAmount.total_amount });
      const totalData = await requestPromise({
        uri: "http://127.0.0.1:3002/api/list/period/total",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        qs: {
          dateFrom: moment().format("DD.MM.YYYY"),
          dateTo: moment().format("DD.MM.YYYY")
        },
        json: true // Automatically parses the JSON string in the response
      });
      this.setState({
        totalIncomes: totalData.income,
        totalExpences: totalData.expense
      });
    } catch (err) {
      if (err.statusCode === 401) {
        await this.refreshToken();
        try {
          const lists = await requestPromise({
            uri: "http://127.0.0.1:3002/api/list",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token ||
                this.props.location.state.token}`
            },
            json: true // Automatically parses the JSON string in the response
          });
          this.setState({ lists });

          const totalAmount = await requestPromise({
            uri: "http://127.0.0.1:3002/api/list/total",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token ||
                this.props.location.state.token}`
            },
            json: true // Automatically parses the JSON string in the response
          });
          this.setState({ totalAmount: totalAmount.total_amount });
          const totalData = await requestPromise({
            uri: "http://127.0.0.1:3002/api/list/period/total",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.state.token ||
                this.props.location.state.token}`
            },
            qs: {
              dateFrom: moment().format("DD.MM.YYYY"),
              dateTo: moment().format("DD.MM.YYYY")
            },
            json: true // Automatically parses the JSON string in the response
          });
          this.setState({
            totalIncomes: totalData.income,
            totalExpences: totalData.expense
          });
        } catch (errSecond) {
          store.addNotification({
            title: "Main Page",
            message: errSecond.message,
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
      } else {
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
    }
  }
  handleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };
  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick, false);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }
  handleClick = e => {
    if (this.node.contains(e.target)) return;
    this.setState({ showDropdown: false });
  };
  changeImage = (id, changeImage) => {
    if(id === 'signout') {
      document.getElementById(id).src = changeImage
      ? logoutGreen
      : logoutWhite;
    } else {
      document.getElementById(`image:${id}`).src = changeImage
      ? busketDelete
      : busket;
    }
    
  };
  refreshToken = async () => {
    try {
      const result = await requestPromise({
        uri: "http://127.0.0.1:3002/api/authorization/token/refresh",
        method: "POST",
        json: true,
        headers: {
          user_id: +this.props.location.state.user_id
        },
        body: {
          refresh_token: this.state.refresh_token || this.props.refresh_token
        }
      });
      this.setState({ token: result.token });
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
  }
  deleteList = async (e, id) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      await requestPromise({
        uri: "http://127.0.0.1:3002/api/list",
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        json: true,
        qs: {
          id: +id
        }
      });
      store.addNotification({
        title: "Main Page",
        message: "Список был успешно удален",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 1000,
          onScreen: false
        }
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      if (err.statusCode === 401) {
        this.refreshToken();
       try {
        await requestPromise({
          uri: "http://127.0.0.1:3002/api/list",
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.state.token ||
              this.props.location.state.token}`
          },
          json: true,
          qs: {
            id: +id
          }
        });
        store.addNotification({
          title: "Main Page",
          message: "Список был успешно удален",
          type: "success",
          insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: {
            duration: 1000,
            onScreen: false
          }
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
       } catch(errSecond) {
        store.addNotification({
          title: "Main Page",
          message: errSecond.message,
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
      } else {
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

    }
  };
  printPdf = async (e) => {
    try {
      e.preventDefault();
      const pdfResponse = await axios(`http://127.0.0.1:3002/api/list/period/pdf`, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        params: {
          dateFrom: moment(this.state.dateFrom).format("DD.MM.YYYY"),
          dateTo: moment(this.state.dateTo).format("DD.MM.YYYY")
        } //Force to receive data in a Blob Format
      });

      const file = new Blob(
        [pdfResponse.data],
        { type: 'application/pdf' });
      this.setState({ file: pdfResponse.data });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL, pdfResponse);
      //Open the URL on new Window
      window.open(fileURL);
    } catch (err) {
      if (err.statusCode === 401) {
        await this.refreshToken();
        try {
          e.preventDefault();
      const pdfResponse = await axios(`http://127.0.0.1:3002/api/list/period/pdf`, {
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${this.state.token ||
            this.props.location.state.token}`
        },
        params: {
          dateFrom: moment(this.state.dateFrom).format("DD.MM.YYYY"),
          dateTo: moment(this.state.dateTo).format("DD.MM.YYYY")
        } //Force to receive data in a Blob Format
      });

      const file = new Blob(
        [pdfResponse.data],
        { type: 'application/pdf' });
      this.setState({ file: pdfResponse.data });
      //Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL, pdfResponse);
      //Open the URL on new Window
      window.open(fileURL);
        } catch(errSecond) {
          store.addNotification({
            title: "Pdf print",
            message: errSecond.message,
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
      } else {
        store.addNotification({
          title: "Pdf print",
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

    }
  }
  render() {
    return (
      <React.Fragment>
        <AddItemFormComponent
          lists={this.state.lists}
          displayAddItemModal={this.state.displayAddItemModal}
          token={this.state.token || this.props.location.state.token}
        />
        <AddListFormComponent
          displayAddListModal={this.state.displayAddListModal}
          token={this.state.token || this.props.location.state.token}
        />
        <ShowPiechartComponent
          displayPiechart={this.state.displayPiechart}
          token={this.state.token || this.props.location.state.token}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          totalIncomes={this.state.totalIncomes}
          totalExpences={this.state.totalExpences}
        />
        <div class="page-wrapper">
          <div class="profile-block">
            <img
              src={`http://127.0.0.1:3002${this.state.user_image}`}
              alt="cat"
              class="image_profile"
            />
            <span class="username_profile">{this.state.username}</span>
            <img
              src={logoutWhite}
              onMouseOver={() => this.changeImage('signout', true)}
              onMouseLeave={() => this.changeImage('signout', false)}
              onClick={async () => {
                try {
                  await requestPromise({
                    uri: "http://127.0.0.1:3002/api/authorization/token/reject",
                    method: "POST",
                    json: true,
                    headers: {
                      Authorization: `Bearer ${this.state.token ||
                        this.props.location.state.token}`
                    },
                    body: {
                      refresh_token: this.state.refresh_token || this.props.refresh_token
                    }
                  });
                  this.props.history.push({
                    pathname: '/',
                });
                } catch(err) {
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
              }}
              id="signout"
              alt="Sign out"
              style = {
                {
                  marginLeft: '10px'
                }
              }
            />
          </div>
          <div class="total-block">
            <span class="total">TOTAL </span>
            <span
              class="total"
              style={{
                color: this.state.totalAmount < 0 ? 'red' : this.state.totalAmount === 0 ? 'white' : 'green'
              }}
            >
              {Math.abs(this.state.totalAmount)}
            </span>
          </div>
          <div class="dropdown" ref={node => (this.node = node)}>
            <button onClick={this.handleDropdown}
              class="dropbtn">
              {this.state.currentListName || 'SELECT LIST'}
            </button>
            <div
              id="myDropdown"
              class="dropdown-content"
              style={{ display: this.state.showDropdown ? "block" : "none" }}
            >
              <div
                className="dropdown-element"
                onClick={() => {
                  this.setState({ displayAddListModal: true });
                  sessionStorage.setItem("displayAddListModal", true);
                }}
              >
                Add list
              </div>
              <div
                className="dropdown-element"
                onClick={() => {
                  this.setState({ showDropdown: !this.state.showDropdown });
                  this.setAllItems();
                }}
              >
                Total
              </div>
              {this.state.lists
                ? this.state.lists.map(list => (
                  <div
                    key={list.id}
                    id={`list:${list.id}`}
                    class="dropdown-element"
                    onClick={() => {
                      this.setState({ showDropdown: !this.state.showDropdown });
                      this.setListItems(list.id, list.name);

                    }}
                  >
                    {list.name}
                    <img
                      src={busket}
                      id={`image:${list.id}`}
                      alt="Delete an element"
                      onMouseOver={() => this.changeImage(list.id, true)}
                      onMouseLeave={() => this.changeImage(list.id, false)}
                      onClick={e => this.deleteList(e, list.id)}
                    />
                  </div>
                ))
                : []}
            </div>
          </div>
          <ul class="list" id="item-list">
            {this.state.items.map(item => (
              <li
                data-tooltip={item.description}
                id={`item:${item.id}`}
                style={{
                  color: item.type === 0 ? "green" : "red"
                }}
                onClick={event => {
                  if (this.state.chosenItemId) {
                    document.getElementById(
                      `item:${this.state.chosenItemId}`
                    ).style.backgroundColor = "white";
                  }
                  event.target.style.backgroundColor =
                    "rgba(196, 196, 196, 0.7)";
                  this.setState({ chosenItemId: item.id, currentListId: item.list_id });
                }}
              >
                {`Name: ${item.name}; Amount: ${item.amount}; Date: ${moment(
                  item.createdAt
                ).format("DD.MM.YYYY")}`}
              </li>
            ))}
          </ul>
          <div class="list-buttons">
            <button
              class="add_button buttons"
              onClick={() => {
                this.setState({ displayAddItemModal: true });
                sessionStorage.setItem("displayAddItemModal", true);
              }}
            >
              <span>ADD ITEM</span>
            </button>
            <button
              class="delete_button buttons"
              onClick={async event => {
                event.preventDefault();
                if (this.state.chosenItemId) {
                  try {
                    await requestPromise({
                      uri: "http://127.0.0.1:3002/api/list/item",
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${this.state.token ||
                          this.props.location.state.token}`
                      },
                      json: true,
                      qs: {
                        list_id: +this.state.currentListId,
                        list_item_id: +this.state.chosenItemId
                      }
                    });
                    store.addNotification({
                      title: "Main Page",
                      message: "Элемент списка был успешно удален",
                      type: "success",
                      insert: "top",
                      container: "top-right",
                      animationIn: ["animated", "fadeIn"],
                      animationOut: ["animated", "fadeOut"],
                      dismiss: {
                        duration: 1000,
                        onScreen: false
                      }
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  } catch (err) {
                    if (err.statusCode === 401) {
                      await this.refreshToken();
                      await requestPromise({
                        uri: "http://127.0.0.1:3002/api/list/item",
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${this.state.token ||
                            this.props.location.state.token}`
                        },
                        json: true,
                        qs: {
                          list_id: +this.state.currentListId,
                          list_item_id: +this.state.chosenItemId
                        }
                      });
                      store.addNotification({
                        title: "Main Page",
                        message: "Элемент списка был успешно удален",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                          duration: 1000,
                          onScreen: false
                        }
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    } else {
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
                  }
                }
              }}
            >
              <span>DELETE</span>
            </button>
          </div>
          <div class="date-block">
            <span class="weekday">{moment().format("dddd")}</span>
            <br />
            <span class="date">{moment().format("DD.MM.YYYY")}</span>
          </div>
          <div class="period-from">
            <span>Period from</span>
            <div
              class="period_date"
              onClick={() => {
                if (
                  document.querySelector(
                    ".react-calendar__month-view__weekdays"
                  )
                ) {
                  document.querySelector(
                    ".react-calendar__month-view__weekdays"
                  ).style = "display:flex; color: black";
                }
              }}
            >
              <DatePicker
                onChange={this.onDateFromChange}
                value={this.state.dateFrom}
                style={
                  {
                    color: 'black'
                  }
                }
              />
            </div>
          </div>
          <div class="period-to">
            <span>to</span>
            <div
              class="period_date"
              onClick={() => {
                if (
                  document.querySelector(
                    ".react-calendar__month-view__weekdays"
                  )
                ) {
                  document.querySelector(
                    ".react-calendar__month-view__weekdays"
                  ).style = "display:flex; color: black";
                }
              }}
            >
              <DatePicker
                onChange={this.onDateToChange}
                value={this.state.dateTo}
                style={
                  {
                    color: 'black'
                  }
                }
                
              />
            </div>
          </div>
          <div class="summ">
            <div>
              <span>INCOMES — </span>
              <span>{this.state.totalIncomes}</span>
            </div>
            <div class="expenses">
              <span>EXPENSES — </span>
              <span>{this.state.totalExpences}</span>
            </div>
          </div>
          <div class="option-buttons">
            <button class="pie-chart buttons" onClick={(e) => {
              e.preventDefault();
              this.setState({ displayPiechart: true });
              sessionStorage.setItem("displayPiechart", true);
            }}>
              <span>PIE CHART</span>
            </button>
            <button class="calculate buttons" onClick={this.calculateAmount}>
              <span>CALCULATE</span>
            </button>
            <button class="pdf buttons" onClick={this.printPdf}>
              <span>PRINT PDF</span>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default PageComponent;
