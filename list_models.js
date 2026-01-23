const apiKey = "AIzaSyD7yIjDdNzUd8fQYo9mOxhMyb6USax432Y";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err) => console.error(err));
