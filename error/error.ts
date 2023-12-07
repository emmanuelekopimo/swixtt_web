const caption: HTMLParagraphElement = document.querySelector(".caption")!;

let urlParams = new URLSearchParams(window.location.search);
let errorType = urlParams.get("e"); // Error type
let tableID = urlParams.get("t"); // Table ID

if (errorType == "not-found") {
  caption.innerHTML = `The time table you requested does not exist.
    You can <a href="./../view/?t=${tableID}">retry</a> or 
    <a href="./../index.html">go back to home</a>`;
} else if (errorType == "private") {
  caption.innerHTML = `The time table you requested is private. If this time table belongs to you, 
      you can <a href="./../account/">log in</a> to preview and edit. 
      <a href="./../index.html">Back to home</a>`;
} else if (errorType == "deleted") {
  caption.innerHTML = `The time table you requested has been deleted.
        <a href="./../index.html">Back to home</a>`;
} else if (errorType == "unknown") {
  caption.innerHTML = `An unknown error occured. That's all we know
          <a href="./../index.html">Back to home</a>`;
} else if (errorType == "verify-email") {
  caption.innerHTML = `Check your inbox. A verification email was sent to you. Use the link to verify your email
          <a href="./../index.html">Back to home</a>`;
} else {
  caption.innerHTML = `A fatal error occured. Help us fix this by 
            <a href="https://swixtt.cyclic.app/report/?t=${tableID}">reporting</a>.
            <a href="./../index.html">Back to home</a>`;
}
