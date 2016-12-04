(function() {
  const $gameDef = document.getElementById('game--def');
  const $gameEntry = document.getElementById('game--entry');
  const $gamePoints = document.getElementById('game--points');
  const $gameTimer = document.getElementById('game--timer');
  const $bg = document.getElementById('background');
  const $twitterShare = document.querySelector('.twitter-share-button');
  const $replayBtn = document.querySelector('.play-again');
  const cancelPattern = '17,67';
  let points = 0;

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

  // Display points data
  function updatePoints(points) {
    $gamePoints.innerHTML = points;
  }

  // Sanitize Utility
  function sanitizeTweet(text) {
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/ /g, '%20');
    text = text.replace(/:/g, '%3A');
    text = text.replace(/\//g, '%2F');
    return text;
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
      let currentCmdName = '';

      function nextEntry() {
        let randomItem = dataArray[randomizeValue(data)];
        $gameDef.innerHTML = randomItem.desc;
        currentCmdName = randomItem.command;
        currentPattern = randomItem.keyBinding.join();
        activeEntry = [];
      }

      nextEntry()
      
      // for every keydown, check to see if the answer is complete yet, or if ctrl+c was clicked to skip it

      function newGameItem() {
        $gameEntry.innerHTML = '';
        nextEntry();
      }

      function checkKey(e) {
        if (finished) return;
        e = e || window.event;
        activeEntry.push(e.keyCode);
        $gameEntry.innerHTML += e.key;

        // backspace to clear entry
        if (e.keyCode === 8) {
          $gameEntry.innerHTML = '';
        }

        if (activeEntry.join().includes(cancelPattern)) {
          // show answers in console to check afterward
          console.log('action: ' + $gameDef.innerHTML, '\ncommand: ' + currentCmdName);
          
          // clear for new entry
          activeEntry = [];
          newGameItem();
        } else if (activeEntry.join().includes(currentPattern)) {
          points++;
          updatePoints(points);

          $bg.classList.add('rainbow-roll');
          window.setTimeout(function() {
            $bg.classList.remove('rainbow-roll');
          }, 800);

          newGameItem();
        }
      }

      // init keydown function
      document.onkeydown = checkKey;
    }
  });

  // Start Game and counter

  let started = false;
  let finished = false;

  window.onkeydown = function() {
    if(!started) {
      started = true;
      $gameEntry.classList = '';

      let counter = 30;
      
      var countdownTimer = setInterval(function() {
        counter--;
        if(counter <= 0) {
          finished = true;
          document.body.classList += 'game-over';
          window.clearInterval(countdownTimer);

          let tweetText = sanitizeTweet('I got ' + points + ' points in 30 seconds playing a little CLI game by @una! ' + window.location.href);

          $twitterShare.setAttribute('href', 'https://twitter.com/intent/tweet?text=' + tweetText);
          $twitterShare.style.display = "inline-block";
          $replayBtn.style.display = "inline-block";

        } else {
          $gameTimer.innerHTML = counter.toString();
        }
      }, 1000);
    }
  };
})();