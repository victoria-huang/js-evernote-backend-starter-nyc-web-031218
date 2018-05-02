document.addEventListener('DOMContentLoaded', () => {
  let newUserForm = document.getElementById("create-user-form");
  newUserForm.addEventListener('submit', handleNewUser)

  let loginForm = document.getElementById("login-form");
  loginForm.addEventListener('submit', handleExistingUser)

  function handleExistingUser(event) {
    event.preventDefault();
    let name = document.getElementById("user-name").value;
    fetch('http://localhost:3000/api/v1/users').then(res => res.json()).then(json => findExistingUser(json, name)).then(user => showUser(user))
  }

  function handleNewUser(event) {
    event.preventDefault();
    let name = document.getElementById("new-user-name").value;
    createUser(name);
  }
})

function findExistingUser(users, name) {
  return users.find((user) => { return user.name === name; })
}

function createUser(name) {
  let newUser = { name: name }

  fetch('http://localhost:3000/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(newUser),
    headers: {
      'Content-Type':'application/json'
    }
  }).then(res => res.json()).then(json => getUser(json));
}

function getUser(user) {
  fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
    method: 'GET',
    headers: {
      'Content-Type':'application/json'
    }
  }).then(res => res.json())
    .then(json => showUser(json));
}

function handleNewNote(userId) {
  if (document.getElementById("show-note") !== null) {
    document.getElementById("show-note").remove()
  } else if (document.getElementById("new-note-form") !== null) {
    document.getElementById("new-note-form").remove()
  } else if (document.getElementById("edit-note-form") !== null) {
    document.getElementById("edit-note-form").remove()
  }

  let noteShowPage = document.getElementById("note-show-page")
  let noteFormDiv = "<div id='new-note-form'> <h1>Create a New Note!</h1> <form id='create-note-form' action='#' method='post'><label for='new-note-title'>Title: </label><textarea required type='text' id='new-note-title' placeholder='title'></textarea><br><br><label for='new-note-body'>Content: </label><textarea required type='text' id='new-note-body' placeholder='content'></textarea><br><br><input type='submit' value='Create New Note'></form></div>"
  noteShowPage.innerHTML += noteFormDiv;

  let noteForm = document.getElementById("create-note-form");
  noteForm.addEventListener("submit", handleCreateNote)

  function handleCreateNote(event) {
    event.preventDefault();
    let title = document.getElementById("new-note-title").value;
    let body = document.getElementById("new-note-body").value;
    let noteFormDiv = document.getElementById("new-note-form");
    noteFormDiv.remove();
    if (document.getElementById("empty-note-message") !== null) {
      document.getElementById("empty-note-message").remove()
    }
    createNote(title, body, userId);
  }
}

function showUser(user) {
  document.getElementById("index-page").remove();
  let welcomePage = document.getElementById("welcome-page")
  let name = user.name;
  let p = document.createElement('p');
  p.innerHTML = `User: ${name}`;
  welcomePage.append(p);
  let button = document.createElement('button')
  button.setAttribute('id', "create-note")
  button.setAttribute("onclick", `handleNewNote(${user.id})`)
  button.innerText = "Create a Note"
  // welcomePage.append(button)
  welcomePage.innerHTML += "<div id='note-side-bar'></div>"
  let sideBar = document.getElementById("note-side-bar");
  sideBar.append(button);
  sideBar.innerHTML += "<h3>Notes: </h3><ol id='note-list'></ol></div>";
  welcomePage.innerHTML += "<div id='note-show-page'></div>"

  let noteList = document.getElementById('note-list')
  if (user.notes.length === 0) {
    let noteMessage = document.createElement('p');
    noteMessage.setAttribute("id", "empty-note-message")
    noteMessage.innerText = "You currently have no notes"
    noteList.append(noteMessage)
  } else {
    user.notes.forEach((note) => {
      let noteListEle = document.createElement("li")
      noteListEle.setAttribute("id", `note-id-${note.id}`);
      noteListEle.innerText = `${note.title}`

      noteListEle.addEventListener('click', function(event){
        getNote(note)
      })

      noteList.append(noteListEle);
    });
  }
}

function createNote(title, body, userId) {
  let newNote = { title: title, body: body, user_id: userId }

  fetch('http://localhost:3000/api/v1/notes', {
    method: 'POST',
    body: JSON.stringify(newNote),
    headers: {
      'Content-Type':'application/json'
    }
  }).then(res => res.json()).then(json => getNote(json));
}

function getNote(note) {
  fetch(`http://localhost:3000/api/v1/notes/${note.id}`, {
    method: 'GET',
    headers: {
      'Content-Type':'application/json'
    }
  }).then(res => res.json())
    .then(json => showNote(json));
}

function editNote(note) {
  if (document.getElementById("show-note") !== null) {
    document.getElementById("show-note").remove()
  } else if (document.getElementById("new-note-form") !== null) {
    document.getElementById("new-note-form").remove()
  } else if (document.getElementById("edit-note-form") !== null) {
    document.getElementById("edit-note-form").remove()
  }

  let noteShowPage = document.getElementById("note-show-page")
  let noteEditFormDiv = `<div id='edit-note-form'> <h1>Edit Note!</h1> <form id='create-note-form' action='#' method='patch'><label for='edit-note-title'>Title: </label><textarea required type='text' id='edit-note-title'>${note.title}</textarea><br><br><label for='edit-note-body'>Content: </label><textarea required type='text' id='edit-note-body'>${note.body}</textarea><br><br><input type='submit' value='Edit Note'></form></div>`
  noteShowPage.innerHTML += noteEditFormDiv;

  let noteEditForm = document.getElementById('edit-note-form');
  noteEditForm.addEventListener("submit", handleEditNote)

  function handleEditNote(event) {
    event.preventDefault();
    let title = document.getElementById("edit-note-title").value;
    let body = document.getElementById("edit-note-body").value;
    let noteEditFormDiv = document.getElementById("edit-note-form");
    noteEditFormDiv.remove();
    patchNote(title, body, note)
  }
}

function patchNote(title, body, note) {
  let editBody = { title: title, body: body }
  fetch(`http://localhost:3000/api/v1/notes/${note.id}`, {
    method: 'PATCH',
    body: JSON.stringify(editBody),
    headers: {
      'Content-Type':'application/json'
    }
  }).then(res => res.json()).then(json => showNote(json))
}

function deleteNote(note) {
  let noteListEle = document.getElementById(`note-id-${note.id}`)
  noteListEle.remove()
  let showDiv = document.getElementById('show-note')
  showDiv.remove()

  if (document.querySelector('#note-list li') === null) {
    let noteList = document.getElementById('note-list')
    let noteMessage = document.createElement('p');
    noteMessage.setAttribute("id", "empty-note-message")
    noteMessage.innerText = "You currently have no notes"
    noteList.append(noteMessage)
  }

  fetch(`http://localhost:3000/api/v1/notes/${note.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type':'application/json'
    }
  })
}

function showNote(note){
  if (document.getElementById("show-note") !== null) {
    document.getElementById("show-note").remove()
  } else if (document.getElementById("new-note-form") !== null) {
    document.getElementById("new-note-form").remove()
  } else if (document.getElementById("edit-note-form") !== null) {
    document.getElementById("edit-note-form").remove()
  }

  let noteShowPage = document.getElementById("note-show-page")
  let showDiv = document.createElement('div')
  showDiv.setAttribute('id', 'show-note')
  let header = document.createElement('h1')
  header.innerText = note.title
  let para = document.createElement('p')
  para.innerText = note.body
  let editButton = document.createElement('button')
  editButton.setAttribute("id", "edit-button")
  editButton.innerText = "Edit Note"
  editButton.addEventListener('click', (event) => {
    editNote(note);
  })

  let delButton = document.createElement('button')
  delButton.setAttribute("id", "delete-button")
  delButton.innerText = "Delete Note"
  delButton.addEventListener('click', (event) => {
    deleteNote(note);
  })

  showDiv.append(header, para, editButton, delButton)
  noteShowPage.append(showDiv)

  if (document.getElementById(`note-id-${note.id}`) === null){
    let noteList = document.getElementById("note-list"); // ol element
    // make li elements
    let noteListEle = document.createElement("li")
    noteListEle.setAttribute("id", `note-id-${note.id}`);
    noteListEle.innerText = `${note.title}`

    noteListEle.addEventListener('click', function(event){
      getNote(note)
    })
    //append li to ol
    noteList.append(noteListEle);
  } else {
    let noteListEle = document.getElementById(`note-id-${note.id}`)
    noteListEle.innerText = `${note.title}`
  }
 }
