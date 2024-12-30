const alert = (msg)=> {
    const alertEl = document.getElementById("alertEl");

    alertEl.innerHTML = msg;
    // alertEl.classList.add('active')
    alertEl.style.top('20px')

    // setTimeout(() => {
    // alertEl.classList.remove('active')
    // }, 2000);
}

alert("hi")