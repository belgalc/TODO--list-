let form = document.querySelector(".form");
let inputField = document.querySelector(".input");
let submitBtn = document.querySelector(".add");
let tasksArea = document.querySelector(".tasks");
let delBtn = document.querySelector(".delete");
let colorsArea = document.querySelector(".colors-container");
let colors = document.querySelectorAll(".colors-container div");
let title = document.querySelector("h1");
let subTitle = document.querySelector("h4");
let tasksArray = [];

//Toggle click
subTitle.onclick = () => {
  if (!colorsArea.classList.contains("clicked")) {
    colorsArea.classList.toggle("clicked");
  } else if (colorsArea.classList.contains("clicked")) {
    colorsArea.classList.toggle("clicked");
  }
};

if (localStorage.getItem("Tasks")) {
  tasksArray = JSON.parse(localStorage.getItem("Tasks"));
}
delBtn.onclick = () => {
  tasksArray = [];
  localStorage.removeItem("Tasks");
  tasksArea.innerHTML = "";
  delBtn.style.display = "none";
};
if (!localStorage.getItem("Tasks")) {
  delBtn.style.display = "none";
}
submitBtn.onclick = () => {
  //Empty the input field
  if (inputField.value != "") {
    addTaskToArray(inputField.value);
    addTasksToPage(tasksArray);
    addTaskstoLocalStorage(tasksArray);
    inputField.value = "";
  }
  if (localStorage.getItem("Tasks")) {
    delBtn.style.display = "block";
  }
};
tasksArea.addEventListener("click", (e) => {
  //Delete Button
  if (e.target.classList.contains("del")) {
    deleteTaskFromLocalStorage(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.remove();
  }
  // Task element
  if (e.target.classList.contains("task")) {
    toggleTaskStatus(e.target.getAttribute("data-id"));
    e.target.classList.toggle("done");
  }
});
addTaskToArray = (taskText) => {
  //Task data
  let task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };

  //Push task to array
  tasksArray.push(task);
};

addTasksToPage = (tasksArray) => {
  //Empty tasks div
  tasksArea.innerHTML = "";
  //Loop tasks array to add them to page
  tasksArray.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));
    if (task.completed == true) {
      div.classList.toggle("done");
    }
    //Create delete button
    let delBtnS = document.createElement("span");
    delBtnS.className = "del";
    delBtnS.appendChild(document.createTextNode("Delete"));
    ColorChanger(delBtnS);
    //Append btn to task's div
    div.appendChild(delBtnS);
    tasksArea.appendChild(div);
  });
};

addTaskstoLocalStorage = (tasksArray) => {
  localStorage.setItem("Tasks", JSON.stringify(tasksArray));
};
getDataFromLocalStorage = () => {
  let data = localStorage.getItem("Tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addTasksToPage(tasks);
  }
};
getDataFromLocalStorage();

deleteTaskFromLocalStorage = (taskId) => {
  tasksArray = tasksArray.filter((task) => task.id != taskId);
  addTaskstoLocalStorage(tasksArray);
};

toggleTaskStatus = (taskId) => {
  for (let i = 0; i < tasksArray.length; i++) {
    if (tasksArray[i].id == taskId) {
      tasksArray[i].completed == false
        ? (tasksArray[i].completed = true)
        : (tasksArray[i].completed = false);
    }
  }
  addTaskstoLocalStorage(tasksArray);
};

//Color changer
ColorChanger(delBtn, submitBtn, tasksArea);

function ColorChanger(...els) {
  if (localStorage.getItem("Color")) {
    //Add color to div
    for (let e of els) {
      e.style.backgroundColor = localStorage.getItem("Color");
    }
    title.style.color = localStorage.getItem("Color");
    //Remove active class from all div
    colors.forEach((div) => {
      div.classList.remove("active");
    });
    //Add active color to div
    document
      .querySelector(`[data-color="${localStorage.getItem("Color")}"]`)
      .classList.add("active");
  }
  colors.forEach((div) => {
    div.addEventListener("click", (div) => {
      //remove active class from all divs
      colors.forEach((div) => {
        div.classList.remove("active");
      });
      //add active class to current div
      div.currentTarget.classList.add("active");
      //add current color to local storage
      localStorage.setItem("Color", div.currentTarget.dataset.color);
      //Change color
      for (let e of els) {
        e.style.backgroundColor = div.currentTarget.dataset.color;
      }
      title.style.color = div.currentTarget.dataset.color;
    });
  });
}
