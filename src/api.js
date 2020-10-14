// NOTE: not related to the api but just added in here to 
// improve overall visibility in RenderMember.js
// this function just fetches the ember members and returns
// a json response object
export function fetchEmberMembers(){
  return fetch("https://api.github.com/orgs/emberjs/members", {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
}

// ----------------Related to my Api----------------------

// this funciton will GET who has been followed
// and return a JSON response object
export function fetchFollows() {
  return fetch("/api/follows").then((response) => {
    return response.json();
  });
}

// this function will UPDATE (POST) a person to followed list
// its parameter is a login object which is just the github id, 
// and login name of an ember member. I could have just passed in the
// github id but I added the login name for better clarity
// this function also returns a JSON response object
export function addFollow(loginObject) {
  return fetch("/api/follows", {
    method: "POST",
    body: JSON.stringify(loginObject),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    return response.json();
  });
}

// this function will DELETE a person from followed list
// the parameter is the loginID which is the github id.
// need a unique key so that is why i chose to use the github id.
export function deleteFollow(loginID) {
  return fetch(`/api/follows/${loginID}`, {
    method: "DELETE",
  });
}
