const adopt = document.querySelectorAll('.adopt');
const ban = document.querySelectorAll(".fa-ban");

console.log('hi')
Array.from(adopt).forEach(function(element) {
      element.addEventListener('click', function(){
          console.log(this.parentNode.childNodes)
        const catName = this.parentNode.childNodes[1].innerText
        const img = this.parentNode.childNodes[3].src
         console.log(catName,img)
        fetch('adoptCat', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'catName': catName,
            'img': img,
            'available': true
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

 

Array.from(ban).forEach(function(element) {
      element.addEventListener('click', function(){
          console.log(this.parentNode.parentNode.childNodes)
        const catName = this.parentNode.parentNode.childNodes[1].innerText
        const img = this.parentNode.parentNode.childNodes[3].src
        
        fetch('adoptCat', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'catName': catName,
            'img': img,
            'available': true
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
