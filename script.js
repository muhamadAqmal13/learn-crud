let minPage = 1;
let maxPage = 1;
let search = "";
let order_by = "";
let sort_by = "";
let paramsLimit = ``;
let page = 1;
let paramsPage = ``;
let keySeach = ``;
/**
 * Fetch datas
 */

const getData = (query = "") =>
  new Promise((resolve, reject) => {
    $.ajax({
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "https://muhamadaqmal13.github.io",
      },
      url: `https://learn-crud-server.muhamadaqmal.repl.co/api/v1/employees${query}`,
      success: function (res) {
        clearTableEmpty();
        resolve(res);
      },
      error: (xhr, status, error) => {
        clearTable();
        clearTableEmpty();
        displayTableEmpty();
      },
    });
  });

const getDetailData = (id) =>
  new Promise((resolve, reject) => {
    $.ajax({
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "https://muhamadaqmal13.github.io",
      },
      url: `https://learn-crud-server.muhamadaqmal.repl.co/api/v1/detail-employee/${id}`,
      success: function (res) {
        resolve(res);
      },
      error: (err) => {
        console.log(err.statusText);
      },
    });
  });

const getDeleteData = (id) =>
  new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "https://muhamadaqmal13.github.io",
      },
      url: `https://learn-crud-server.muhamadaqmal.repl.co/api/v1/delete-employee/${id}`,
      success: function (res) {
        resolve(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  });
const postEditData = (data) =>
  new Promise(async (resolve, reject) => {
    $.ajax({
      method: "PATCH",
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "https://muhamadaqmal13.github.io",
      },
      url: `https://learn-crud-server.muhamadaqmal.repl.co/api/v1/update-employee`,
      data,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        resolve(res);
      },
      error: async (xhr, status, error) => {
        const res = xhr.responseJSON;
        displayError(res);
      },
    });
  });
const postAddData = (data) =>
  new Promise(async (resolve, reject) => {
    $.ajax({
      method: "POST",
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "https://muhamadaqmal13.github.io",
      },
      url: `https://learn-crud-server.muhamadaqmal.repl.co/api/v1/add-employee`,
      data,
      contentType: "application/json; charset=utf-8",
      success: function (res) {
        resolve(res);
      },
      error: async (xhr, status, error) => {
        const res = xhr.responseJSON;
        displayError(res);
      },
    });
  });

const paramsRequest = async () => {
  let allParams = [];
  if (search != "") {
    allParams.push(search);
  }
  if (sort_by != "") {
    allParams.push(sort_by);
  }
  if (order_by != "") {
    allParams.push(order_by);
  }
  if (paramsLimit != "") {
    allParams.push(paramsLimit);
  }
  if (paramsPage != "") {
    allParams.push(paramsPage);
  }
  let params = `?`;
  for (let i = 0; i < allParams.length; i++) {
    const el = allParams[i];
    if (i == 0) {
      params += el;
    } else {
      params += `&${el}`;
    }
  }

  changeUrl(params);
  const datas = await getData(params);
  clearTable();
  const max = await maxPages(datas);
  $("#page").text(`${page} of ${max}`);
  await displayTable(datas);
};

const maxPages = async (datas) => {
  const totalData = datas.total;
  const limit = datas.limit;

  if (totalData < limit) {
    maxPage = "1";
    page = 1;
    $("#firstPage").attr("disabled", true);
    $("#previous").attr("disabled", true);
    $("#lastPage").attr("disabled", true);
    $("#next").attr("disabled", true);
  } else {
    const max = totalData / limit;
    if (max.toString().includes(".")) {
      maxPage = parseInt(max) + 1;
    } else {
      maxPage = max;
    }
    handleDisabledButton();
  }
  return maxPage;
};
/**
 * Handle Tables
 */
const getDataTable = async () => {
  const datas = await getData();
  if (datas.msg.toLowerCase() == "Data masih kosong") {
    page = 1;
    maxPage = 1;
    handleDisabledButton();
    displayTableEmpty();
  } else {
    handleDisabledButton();
    displayTable(datas);
    maxPages(datas);
  }
};
const clearTable = () => {
  return $("#data-body").html("");
};

const displayTable = ({ data }) => {
  let dataHtml;
  if (typeof data.length != "undefined") {
    data.forEach((el) => {
      dataHtml += `
      <tr data-id="${el._id}">
          <td>${el._id}</td>
          <td>${el.name}</td>
          <td>${el.email}</td>
          <td>${el.mobile}</td>
          <td class="actions" data-id="${el._id}">
              <button id="btn-detail" onclick="handleBtnDetail(this)">Detail</button>
              <button id="btn-edit" onclick="handleBtnEdit(this)">Edit</button>
              <button id="btn-delete" onclick="handleBtnDelete(this)">Delete</button>
          </td>
      </tr>`;
    });
  } else {
    dataHtml = `
    <tr data-id="${data._id}">
        <td>${data._id}</td>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.mobile}</td>
        <td class="actions" data-id="${data._id}">
            <button id="btn-detail" onclick="handleBtnDetail(this)">Detail</button>
            <button id="btn-edit" onclick="handleBtnEdit(this)">Edit</button>
            <button id="btn-delete" onclick="handleBtnDelete(this)">Delete</button>
        </td>
    </tr>`;
  }
  return $("#data-body").html(dataHtml);
};

const displayTableEmpty = () => {
  const element = `
  <div class="container-empty">
    <p>Data is empty</p>
  </div>`;
  $(element).insertAfter("table");
  $("#firstPage").attr("disabled", true);
  $("#previous").attr("disabled", true);
  $("#lastPage").attr("disabled", true);
  $("#next").attr("disabled", true);
};
const clearTableEmpty = () => {
  $(".container-empty").remove();
};

/**
 * Handle Modals
 */
const removeModal = () => {
  $("#modal").remove();
};

const displayModal = (element) => {
  $(element).insertAfter("#table_id");
};

const changeBirthDay = ({ birthday }) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const datas = birthday.split("-");

  const month = months[parseInt(datas[1] - 1)];
  const date = parseInt(datas[datas.length - 1]);
  const year = datas[0];

  let ordinalNumber;
  if (date == 1) {
    ordinalNumber = "st";
  } else if (date == 2) {
    ordinalNumber = "nd";
  } else if (date == 3) {
    ordinalNumber = "rd";
  } else {
    ordinalNumber = "th";
  }

  return `${month} ${date}<sup>${ordinalNumber}</sup>, ${year}`;
};
const detailData = async (e) => {
  const idElementDetail = $(e.parentElement).data("id");
  const detailData = await getDetailData(idElementDetail);

  return detailData;
};

/**
 * Modal Detal
 */
const displayModalDetail = ({ data }) => {
  const newStyleBirthday = changeBirthDay(data);
  const elementModal = `
  <div class="container-modal" id="modal">
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">
          <h2>Detail Employee</h2>
        </div>
        <div class="modal-close">
          <h2 onclick="removeModal(this)">x</h2>
        </div>
      </div>
      <div class="modal-content">
        <div class="datas">
          <div class="data">
            <p>ID</p>
            <p>: ${data._id}</p>
          </div>
          <div class="data">
            <p>Email</p>
            <p>: ${data.email}</p>
          </div>
          <div class="data">
            <p>Name</p>
            <p>: ${data.name}</p>
          </div>
          <div class="data">
            <p>Mobile</p>
            <p>: ${data.mobile}</p>
          </div>
          <div class="data">
            <p>Address</p>
            <p>: ${data.address}</p>
          </div>
          <div class="data">
            <p>Birthday</p>
            <p>: ${newStyleBirthday}</p>
          </div>
        </div>
      </div>
      <div class="button">
        <button onclick="removeModal(this)">Close</button>
      </div>
    </div>
  </div>
  `;
  displayModal(elementModal);
};

const handleBtnDetail = async (e) => {
  const datas = await detailData(e);
  displayModalDetail(datas);
};

/**
 * Modal Detele
 */
const displayModalDelete = ({ data }) => {
  const newStyleBirthday = changeBirthDay(data);
  const elementModal = `
  <div class="container-modal" id="modal">
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">
          <h2>Detail Employee</h2>
        </div>
        <div class="modal-close">
          <h2 onclick="removeModal(this)">x</h2>
        </div>
      </div>
      <div class="modal-content">
        <div class="datas">
          <div class="data">
            <p>ID</p>
            <p>: ${data._id}</p>
          </div>
          <div class="data">
            <p>Email</p>
            <p>: ${data.email}</p>
          </div>
          <div class="data">
            <p>Name</p>
            <p>: ${data.name}</p>
          </div>
          <div class="data">
            <p>Mobile</p>
            <p>: ${data.mobile}</p>
          </div>
          <div class="data">
            <p>Address</p>
            <p>: ${data.address}</p>
          </div>
          <div class="data">
            <p>Birthday</p>
            <p>: ${newStyleBirthday}</p>
          </div>
        </div>
      </div>
      <div class="info">
        <p>Are you sure want to delete this employee?</p>
      </div>
      <div class="button">
        <button onclick="removeModal(this)">Close</button>
        <button onclick="deleteEmployee(this)" data-id="${data._id}">Delete</button>
      </div>
    </div>
  </div>
  `;
  displayModal(elementModal);
};
const handleBtnDelete = async (e) => {
  const datas = await detailData(e);
  displayModalDelete(datas);
};
const deleteEmployee = async (e) => {
  const id = $(e).data("id");
  const deleteData = await getDeleteData(id);
  removeModal();
  await getDataTable();
  $("#page").text(`${page} of ${maxPage}`);
};

/**
 * Modal Add
 */
const displayModalAdd = () => {
  const element = `
  <div class="container-modal" id="modal">
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">
          <h2>Add Employee</h2>
        </div>
        <div class="modal-close">
          <h2 onclick="removeModal(this)">x</h2>
        </div>
      </div>
      <div class="modal-content">
        <form class="form-input">
          <label for="name">
            <p>Name</p>
            <div class="input">
              <input type="text" id="name" autocomplete="off" />
              <h6></h6>
            </div>
          </label>
          <label for="email">
            <p>Email</p>
            <div class="input">
              <input type="email" id="email" autocomplete="off" />
              <h6></h6>
            </div>
          </label>
          <label for="mobile">
            <p>Mobile</p>
            <div class="input">
              <input type="text" id="mobile" autocomplete="off" />
              <h6></h6>
            </div>
          </label>
          <label for="birthday">
            <p>Birtday</p>
            <div class="input">
              <input type="date" id="birthday" autocomplete="off" />
              <h6></h6>
            </div>
          </label>
          <div id="id-label">
            <div class="label">
              <p>Address</p>
            </div>
            <div class="container-input-address">
              <div class="address">
                <input
                  type="text"
                  id="address"
                  autocomplete="off"
                />
                <span
                  class="btn-add-address"
                  onclick="handleAddAddress(this)"
                  >+</span
                >
              </div>
              <h6></h6>
            </div>
          </div>
          </form>
          </div>
          <div class="button">
            <button onclick="removeModal(this)">Close</button>
            <button onclick="handleAddEmployee(this)">Submit</button>
          </div>
    </div>
  </div>
  `;
  displayModal(element);
};
const handleBtnAdd = (e) => {
  displayModalAdd();
};
const handleAddAddress = (e) => {
  const lengthAddress = $(".address").length;
  if (lengthAddress >= 3) {
    return alert("Address sudah maximal");
  }
  const elementAddress = `
  <div class="address">
    <input
      type="text"
      id="address${lengthAddress}"
      autocomplete="off"
    />
    <span class="btn-add-address" onclick="handleRemoveAddress(this)">x</span>
  </div>
  `;
  $(elementAddress).insertAfter(`.address:nth-child(${lengthAddress})`);
};
const handleRemoveAddress = (e) => {
  $(e).parent().remove();
};
const handleAddEmployee = async (e) => {
  const { success, data } = await verificationForm();
  if (success) {
    const add = await postAddData(data);
    removeModal();
    await getDataTable();
    $("#page").text(`${page} of ${maxPage}`);
  }
};

/**
 *  Modal Edit
 */
const handleBtnEdit = async (e) => {
  const datas = await detailData(e);
  displayModalEdit(datas);
};

const displayModalEdit = ({ data }) => {
  const element = `
  <div class="container-modal" id="modal">
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">
          <h2>Add Employee</h2>
        </div>
        <div class="modal-close">
          <h2 onclick="removeModal(this)">x</h2>
        </div>
      </div>
      <div class="modal-content">
        <form class="form-input">
          <div id="input-id">
            <p>ID</p>
            <div class="input">
              <input type="text" id="id" autocomplete="off" disabled value="${data._id}" data-id="${data._id}"/>
              <h6></h6>
            </div>
          </div>
          <label for="name">
            <p>Name</p>
            <div class="input">
              <input type="text" id="name" autocomplete="off" value="${data.name}"/>
              <h6></h6>
            </div>
          </label>
          <label for="email">
            <p>Email</p>
            <div class="input">
              <input type="email" id="email" autocomplete="off" value="${data.email}"/>
              <h6></h6>
            </div>
          </label>
          <label for="mobile">
            <p>Mobile</p>
            <div class="input">
              <input type="text" id="mobile" autocomplete="off" value="${data.mobile}"/>
              <h6></h6>
            </div>
          </label>
          <label for="birthday">
            <p>Birtday</p>
            <div class="input">
              <input type="date" id="birthday" autocomplete="off" value="${data.birthday}"/>
              <h6></h6>
            </div>
          </label>
          <div id="id-label">
            <div class="label">
              <p>Address</p>
            </div>
            <div class="container-input-address">
              <div class="address">
                <input
                  type="text"
                  id="address"
                  autocomplete="off"
                  value="${data.address}"
                />
                <span
                  class="btn-add-address"
                  onclick="handleAddAddress(this)"
                  >+</span
                >
              </div>
              <h6></h6>
            </div>
          </div>
        </form>
      </div>
    <div class="button">
      <button onclick="removeModal(this)">Close</button>
      <button onclick="handleEditEmployee(this)">Edit</button>
    </div>
    </div>
  </div>`;
  displayModal(element);
};

const handleEditEmployee = async (e) => {
  const { success, data } = await verificationForm();
  if (success) {
    const edit = await postEditData(data);
    removeModal();
    await getDataTable();
  }
};

/**
 * Form Verification
 */
const createError = (name, msg) => {
  let element;
  if (name == "address") {
    element = $(`#${name}`).parent().next()[0];
  } else {
    element = $(`#${name}`).parent().children()[1];
  }

  $(element).text(msg).addClass("errors");
  setTimeout(() => {
    $(element).text("");
  }, 2000);
};

const displayError = ({ error }) => {
  error.forEach((el) => {
    if (typeof el.name != "undefined") {
      createError("name", el.name);
    }
    if (typeof el.email != "undefined") {
      createError("email", el.email);
    }
    if (typeof el.mobile != "undefined") {
      createError("mobile", el.mobile);
    }
    if (typeof el.birthday != "undefined") {
      createError("birthday", el.birthday);
    }
    if (typeof el.address != "undefined") {
      createError("address", el.address);
    }
  });
};
const verificationForm = async (e) => {
  let _id;
  if ($("#id").length != 0) {
    _id = $("#id").data("id");
  }
  const name = $("#name")[0].value.trim();
  const email = $("#email")[0].value.trim();
  const mobile = $("#mobile")[0].value.trim();
  const birthday = $("#birthday")[0].value.trim();
  let address = $(".address");
  let newAddress = [];
  for (let i = 0; i < address.length; i++) {
    const el = address[i];
    newAddress.push($(el).children()[0].value);
  }
  address = newAddress.join(", ");
  let data;
  if ($("#id").length != 0) {
    data = JSON.stringify({
      _id,
      email,
      name,
      mobile,
      birthday,
      address,
    });
  } else {
    data = JSON.stringify({
      email,
      name,
      mobile,
      birthday,
      address,
    });
  }
  if (isNaN(parseInt(mobile))) {
    createError("mobile", "Invalid format");
    return { success: false, data: null };
  } else {
    return { success: true, data };
  }
};

/**
 * Handle URL
 */
const changeUrl = (query) => {
  history.pushState("", "", query);
};
const getParams = () => {
  const getUrl = new URL(window.location);
  const checkParams = getUrl.href.split("?");
  if (checkParams.length != 1) {
    const params = getUrl.href.split("?")[1].split("&");
    let newParams = [];
    params.forEach((e) => {
      const splitParams = e.split("=");
      const datas = {
        [splitParams[0]]: splitParams[1],
      };
      newParams.push(datas);
    });
    return newParams;
  }
};

/**
 * Handle Search
 */

const handleSearchInput = async (e) => {
  keySeach = e.value.trim();
  console.log(keySeach == "");
  if (keySeach === "") {
    search = "";
    await paramsRequest();
  }
};
const handleBtnSearch = async () => {
  page = 1;
  paramsPage = `page=1`;
  search = `search=${keySeach}`;
  await paramsRequest();
};

/**
 * Handle Sort
 */

const removeAllAttr = (e) => {
  for (let i = 0; i < $("th").children().length; i++) {
    const el = $("th").children()[i];
    if (el.parentElement != e) {
      const getAllDataSet = el.parentElement.dataset.order;
      const elementsArrow = $(el.parentElement)
        .children()
        .children()
        .children();
      const classArrow = $(el.parentElement)
        .children()
        .children()
        .children()
        .attr("class");
      if (typeof classArrow != "undefined") {
        $(elementsArrow).remove();
      }

      if (typeof getAllDataSet != "undefined") {
        $(el.parentElement).removeAttr("data-order");
      }
    }
  }
};

const handleSort = async (e) => {
  removeAllAttr(e);

  const arrows = $(e).children().children()[1];
  const arrowUp = `<i class="bi bi-arrow-up-square-fill"></i>`;
  const arrowDown = `<i class="bi bi-arrow-down-square-fill"></i>`;
  const dataOrder = $(e).attr("data-order");

  let order;
  let sortBy;
  if (dataOrder == "desc" || typeof dataOrder == "undefined") {
    $(e).attr("data-order", "asc");
    $(arrows).html(arrowUp);
    sortBy = $(e).data("table");
    order = $(e).attr("data-order");
  } else {
    $(e).attr("data-order", "desc");
    $(arrows).html(arrowDown);
    sortBy = $(e).data("table");
    order = $(e).attr("data-order");
  }

  order_by = `order_by=${order}`;
  sort_by = `sort_by=${sortBy}`;
  await paramsRequest();
};

/**
 * Handle Pagination
 */
const handleDropDown = async (e) => {
  console.log(e.value);
  paramsLimit = `limit=${e.value}`;
  await paramsRequest();
};

/**
 * Handle Button
 */

const handleDisabledButton = () => {
  if (page == minPage) {
    $("#firstPage").attr("disabled", true);
    $("#previous").attr("disabled", true);
    $("#lastPage").removeAttr("disabled");
    $("#next").removeAttr("disabled");
  } else if (page == maxPage) {
    $("#lastPage").attr("disabled", true);
    $("#next").attr("disabled", true);
    $("#firstPage").removeAttr("disabled");
    $("#previous").removeAttr("disabled");
  } else {
    $("#lastPage").removeAttr("disabled");
    $("#next").removeAttr("disabled");
    $("#firstPage").removeAttr("disabled");
    $("#previous").removeAttr("disabled");
  }
};

const handleBtnFirstPage = async (e) => {
  paramsPage = `page=${(page = 1)}`;
  handleDisabledButton();
  await paramsRequest();
};
const handleBtnNext = async (e) => {
  console.log(page + 1);
  paramsPage = `page=${(page += 1)}`;
  handleDisabledButton();
  await paramsRequest();
};
const handleBtnPrevious = async (e) => {
  paramsPage = `page=${(page -= 1)}`;
  handleDisabledButton();
  await paramsRequest();
};
const handleBtnLastPage = async (e) => {
  paramsPage = `page=${(page = maxPage)}`;
  handleDisabledButton();
  await paramsRequest();
};

(async () => {
  handleDisabledButton();
  const dataTable = await getDataTable();
  $(document).ready(function (e) {
    $(document).keydown(function (e) {
      if (e.keyCode == 27) {
        removeModal();
      }
    });

    $("#search").val("");
    minPage = "1";
    $("#page").text(`${page} of ${maxPage}`);
    changeUrl("index.html");
  });
})();
