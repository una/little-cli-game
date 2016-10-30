(function() {
  const $gameDef = document.getElementById('game--def');
  const $gameEntry = document.getElementById('game--entry');
  const cancelPattern = '17,67';

  // getJSON function
  const getJSON = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      let status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };

  // Get random data
  function randomizeValue(input) {
    const randomPickVal = Math.floor(Math.random() * Object.keys(input).length);
    return randomPickVal;
  }

  // Get Game Questions
  getJSON('./cmd-ref.json', function(err, data) {
    if (err != null) {
      return ('Something went wrong :(');
    } else {

      // TODO: ADD ES6 Transpilation Support
      const dataArray = [... Object.values(data)];
      let activeEntry = [];
      let currentPattern = '';

      function nextEntry() {
        let randomItem = dataArray[randomizeValue(data)];
        $gameDef.innerHTML = randomItem.desc;
        currentPattern = randomItem.keyBinding.join();
      }

      nextEntry()
      
      // for every keydown, check to see if the answer is complete yet, or if ctrl+c was clicked to skip it
      // show entries typing out 
      // if complete, they get a point

      function checkKey(e) {
        e = e || window.event;
        activeEntry.push(e.keyCode);
        $gameEntry.innerHTML += e.key;

        if (activeEntry.join().includes(cancelPattern)) {
          activeEntry = [];
          $gameEntry.innerHTML = '';
          randomItem = dataArray[randomizeValue(data)]
          nextEntry();
        }
        
        console.log(activeEntry, activeEntry.join(), activeEntry.join().includes(cancelPattern));
      }

      // init keydown function
      document.onkeydown = checkKey;

    }
  });
})();