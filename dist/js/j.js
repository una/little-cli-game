'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  var $gameDef = document.getElementById('game--def');
  var $gameEntry = document.getElementById('game--entry');
  var $gamePoints = document.getElementById('game--points');
  var $gameTimer = document.getElementById('game--timer');
  var $bg = document.getElementById('background');
  var $twitterShare = document.querySelector('.twitter-share-button');
  var $replayBtn = document.querySelector('.play-again');
  var cancelPattern = '17,67';
  var points = 0;

  // getJSON function
  var getJSON = function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
      var status = xhr.status;
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
    var randomPickVal = Math.floor(Math.random() * Object.keys(input).length);
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
  getJSON('./cmd-ref.json', function (err, data) {
    if (err != null) {
      return 'Something went wrong :(';
    } else {
      (function () {
        var nextEntry = function nextEntry() {
          var randomItem = dataArray[randomizeValue(data)];
          $gameDef.innerHTML = randomItem.desc;
          currentCmdName = randomItem.command;
          currentPattern = randomItem.keyBinding.join();
          activeEntry = [];
        };

        // for every keydown, check to see if the answer is complete yet, or if ctrl+c was clicked to skip it

        var newGameItem = function newGameItem() {
          $gameEntry.innerHTML = '';
          nextEntry();
        };

        var checkKey = function checkKey(e) {
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
            window.setTimeout(function () {
              $bg.classList.remove('rainbow-roll');
            }, 800);

            newGameItem();
          }
        };

        // init keydown function


        // TODO: ADD ES6 Transpilation Support
        var dataArray = [].concat(_toConsumableArray(Object.values(data)));
        var activeEntry = [];
        var currentPattern = '';
        var currentCmdName = '';

        nextEntry();document.onkeydown = checkKey;
      })();
    }
  });

  // Start Game and counter

  var started = false;

  window.onkeydown = function () {
    if (!started) {
      var countdownTimer;

      (function () {
        started = true;
        $gameEntry.classList = '';

        var counter = 30;

        countdownTimer = setInterval(function () {
          counter--;
          if (counter <= 0) {
            document.body.classList += 'game-over';
            window.clearInterval(countdownTimer);

            var tweetText = sanitizeTweet('I got ' + points + ' points in 30 seconds playing a little CLI game by @una! ' + window.location.href);

            $twitterShare.setAttribute('href', 'https://twitter.com/intent/tweet?text=' + tweetText);
            $twitterShare.style.display = "inline-block";
            $replayBtn.style.display = "inline-block";
          } else {
            $gameTimer.innerHTML = counter.toString();
          }
        }, 1000);
      })();
    }
  };
})();