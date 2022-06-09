export default window.onscroll = function() {myFunction()};


function myFunction() {
  const navbar=document.querySelector("nav");
  console.log(Math.ceil(window.scrollY))
  // console.log(navbar)
    if (Math.ceil(window.scrollY) > 40) {
      navbar.classList.add("sticky")
      // console.log('navbar')
      // console.log('scrollY = ' + window.scrollY);
    } else {
      navbar.classList.remove("sticky");
    }
  }