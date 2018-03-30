
$(function() {
    $('.prompt').html('root@aymane-lotfi:~# ');


  var term = new Terminal('#input-line .cmdline', '#container output');
  term.init();

});

var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'whoami', 'education', 'dreams', 'programming', 'interests', 'contact',  'clear', 'help', 'picture' 
  ];

  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'help':
          var result = "<h2>Help</h2><p><b>whoami</b>: display all my information.<br><b>education</b>: display all my information about my education.<br><b>picture</b>: display my personal picture.<br><b>dreams</b>: display all my information about my achievements in dreams.<br><b>programming</b>: display all my information about my achievements in programming.<br><b>interests</b>: display all my interests.<br><b>contact</b>: Say hi<br><b>blog</b>: Link of my blog<br><b>clear</b>: clear terminal<br><b>help</b>: display this menu.</p>";
          output(result);
          break;
        case 'education':
          var result = "<h3>Education</h3>"+"<p>First Year Baccalaureate in Jaafar al fassi (In progress)<br>";
          output(result);
          break;
        case 'dreams':
          var result = "<h3>My Dreams for The future</h3><p>First Of all Working in One of the biggest companies as Google or Facebook.<br>Building new experiences to billions users <br> Contribute to the tech revolution<br> have a company in Silicon Valley<p>";
          output(result);
          break;
        case 'programming':
          var result = "<h3>Competitive Programmer</h3><p>1th Place in the LegalHack Hackathon  2018 with my team \"LADCHAIN\"<br>Laureate of the Hack&Pitch hackathon by building an app which help people to drop smoking based on the blockchain<br><br>buid an Operating System based on Android<br>Build more than 25 android and iOs<br>More projects on my <a href=\"https://github.com/aymane-lotfi\">Github</a></p>";
          output(result);
          break;
        case 'interests':
          var result = "<h3>Interests</h3><p>Algorithms, Data Structures, Problem Solving, Maths , Football, Literature, Communication,  Internet of Things , Machine Learning , Cloud Computing , Geometry , Big Data , Open Source Technologies...</p>";
          output(result);
          break;
        case 'blog':
          var result = "<h3> (In construction)<a href=\"http://aymane.tk/\">Blog</a></h3>";
          output(result);
          break;
        case 'contact':
          var result = "<h3>Contact</h3><h4>Email: lotfiaymane1@gmail.com<br>Facebook: Aymane Lotfi<br>Instagram: Aymane Lotfi</h4>";
          output(result);
          break;
        case 'whoami':
          var result = "<h1>Aymane Lotfi</h1><p>Programmer and dreams Researcher</p><p>I am 16 years old . I am studying in Jaafar Alfassi . I am from Casablanca, interested in Algorithms Maths and Machine Learning"
         output(result);
          break;
		  case 'picture':
          var result = "<img src=aymane.jpg> </img>";
         output(result);
          break;
            default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<h1>Aymane Lotfi</h1><h3>Programmer and dreams Researcher<br>I am living in Morocco</a></h3><p>Enter "help" for more information.</p><p> -- This website is built with love <3</p>');
    },

    output: output
  }

};
