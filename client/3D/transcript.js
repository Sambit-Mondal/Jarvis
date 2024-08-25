window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

let num1 = 0;
let num2 = 0;
let isRecognitionActive = false; // Flag to track recognition state

function requestMicrophonePermission() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleMicrophonePermission)
      .catch(error => console.error('Error accessing microphone:', error));
  } else {
    console.error('getUserMedia is not supported on this browser');
  }
}

function handleMicrophonePermission(stream) {
  if (isRecognitionActive) {
    recognition.start();
  }
}

function autoScroll() {
  words.scrollTop = words.scrollHeight + 100;
}

// Wave animation element
const waveContainer = document.createElement('div');
waveContainer.classList.add('wave-container');
for (let i = 0; i < 5; i++) {
  const wave = document.createElement('div');
  wave.classList.add('wave');
  waveContainer.appendChild(wave);
}
document.body.appendChild(waveContainer);

document.addEventListener('click', () => {
  requestMicrophonePermission();
});


// Socket.io connection
const socket = io.connect('http://127.0.0.1:5000');

// Common website names to URLs mapping
const commonWebsites = {
  "github": "https://www.github.com",
  "linkedin": "https://www.linkedin.com",
  "google": "https://www.google.com",
  "google classroom": "https://classroom.google.com",
  "google scholar": "https://scholar.google.com",
  "khan academy": "https://www.khanacademy.org",
  "coursera": "https://www.coursera.org",
  "edx": "https://www.edx.org",
  "udemy": "https://www.udemy.com",
  "quizlet": "https://quizlet.com",
  "duolingo": "https://www.duolingo.com",
  "canvas": "https://www.instructure.com/canvas",
  "blackboard": "https://www.blackboard.com",
  "moodle": "https://moodle.org",
  "jstor": "https://www.jstor.org",
  "pubmed": "https://pubmed.ncbi.nlm.nih.gov",
  "ieee xplore": "https://ieeexplore.ieee.org",
  "sciencedirect": "https://www.sciencedirect.com",
  "springerlink": "https://link.springer.com",
  "google drive": "https://drive.google.com",
  "dropbox": "https://www.dropbox.com",
  "onedrive": "https://onedrive.live.com",
  "evernote": "https://evernote.com",
  "notion": "https://www.notion.so",
  "trello": "https://trello.com",
  "asana": "https://asana.com",
  "slack": "https://slack.com",
  "grammarly": "https://www.grammarly.com",
  "wolfram alpha": "https://www.wolframalpha.com",
  "cite this for me": "https://www.citethisforme.com",
  "refworks": "https://www.refworks.com",
  "zotero": "https://www.zotero.org",
  "ted talks": "https://www.ted.com/talks",
  "wikipedia": "https://www.wikipedia.org",
  "crashcourse": "https://www.youtube.com/user/crashcourse",
  "linkedin": "https://www.linkedin.com",
  "the new york times": "https://www.nytimes.com",
  "the guardian": "https://www.theguardian.com",
  "bbc news": "https://www.bbc.com/news",
  "national geographic": "https://www.nationalgeographic.com",
  "google calendar": "https://calendar.google.com",
  "wolfram mathworld": "https://mathworld.wolfram.com",
  "chegg": "https://www.chegg.com",
  "sparknotes": "https://www.sparknotes.com",
  "goodreads": "https://www.goodreads.com",
  "socrative": "https://www.socrative.com",
  "edmodo": "https://www.edmodo.com",
  "pearson": "https://www.pearson.com",
  "openstax": "https://www.openstax.org",
  "k12": "https://www.k12.com",
  "skillshare": "https://www.skillshare.com",
  "pluralsight": "https://www.pluralsight.com",
  "mit opencourseware": "https://ocw.mit.edu",
  "academic earth": "https://www.academicearth.org",
  "futurelearn": "https://www.futurelearn.com",
  "alison": "https://alison.com",
  "wiley online library": "https://onlinelibrary.wiley.com",
  "ted-ed": "https://ed.ted.com",
  "project muse": "https://muse.jhu.edu",
  "sage journals": "https://journals.sagepub.com",
  "academia.edu": "https://www.academia.edu",
  "google books": "https://books.google.com",
  "google patents": "https://patents.google.com",
  "microsoft academic": "https://academic.microsoft.com",
  "airtable": "https://airtable.com",
  "clickup": "https://clickup.com",
  "monday.com": "https://monday.com",
  "basecamp": "https://basecamp.com",
  "todoist": "https://todoist.com",
  "microsoft to do": "https://todo.microsoft.com",
  "habitica": "https://habitica.com",
  "bear": "https://bear.app",
  "simplenote": "https://simplenote.com",
  "quip": "https://quip.com",
  "joplin": "https://joplinapp.org",
  "turtl": "https://turtlapp.com",
  "rescuetime": "https://www.rescuetime.com",
  "toggl": "https://toggl.com",
  "clockify": "https://clockify.me",
  "focus booster": "https://www.focusboosterapp.com",
  "pomofocus": "https://pomofocus.io",
  "google meet": "https://meet.google.com",
  "zoom": "https://zoom.us",
  "microsoft teams": "https://teams.microsoft.com",
  "jitsi meet": "https://meet.jit.si",
  "byju's": "https://www.byjus.com",
  "unacademy": "https://www.unacademy.com",
  "vedantu": "https://www.vedantu.com",
  "toppr": "https://www.toppr.com",
  "doubtnut": "https://www.doubtnut.com",
  "career360": "https://www.career360.com",
  "testbook": "https://testbook.com",
  "embibe": "https://www.embibe.com",
  "gradeup": "https://gradeup.co",
  "nta": "https://nta.ac.in",
  "nios": "https://www.nios.ac.in",
  "epathshala": "https://epathshala.nic.in",
  "zoho": "https://www.zoho.com",
  "freshdesk": "https://freshdesk.com",
  "practo": "https://www.practo.com",
  "the hindu": "https://www.thehindu.com",
  "times of india": "https://timesofindia.indiatimes.com",
  "ndtv": "https://www.ndtv.com",
  "codecademy": "https://www.codecademy.com",
  "freecodecamp": "https://www.freecodecamp.org",
  "udemy": "https://www.udemy.com",
  "pluralsight": "https://www.pluralsight.com",
  "leetcode": "https://leetcode.com",
  "hackerrank": "https://www.hackerrank.com",
  "codeforces": "https://codeforces.com",
  "topcoder": "https://www.topcoder.com",
  "codechef": "https://www.codechef.com",
  "atcoder": "https://atcoder.jp",
  "mdn web docs": "https://developer.mozilla.org",
  "w3schools": "https://www.w3schools.com",
  "stackoverflow": "https://stackoverflow.com",
  "github": "https://github.com",
  "visual studio code": "https://code.visualstudio.com",
  "jetbrains": "https://www.jetbrains.com",
  "docker": "https://www.docker.com",
  "gitlab": "https://about.gitlab.com",
  "dev.to": "https://dev.to",
  "hashnode": "https://hashnode.com",
  "naukri": "https://www.naukri.com",
  "indeed": "https://www.indeed.co.in",
  "monster": "https://www.monsterindia.com",
  "glassdoor": "https://www.glassdoor.co.in",
  "timesjobs": "https://www.timesjobs.com",
  "shine": "https://www.shine.com",
  "fresherworld": "https://www.freshersworld.com",
  "sarkariresult": "https://www.sarkariresult.com",
  "jobstreet": "https://www.jobstreet.co.in",
  "hirect": "https://www.hirect.in",
  "upwork": "https://www.upwork.com",
  "freelancer": "https://www.freelancer.com",
  "fiverr": "https://www.fiverr.com",
  "toptal": "https://www.toptal.com",
  "guru": "https://www.guru.com",
  "peopleperhour": "https://www.peopleperhour.com",
  "flexjobs": "https://www.flexjobs.com",
  "99designs": "https://99designs.com",
  "truelancer": "https://www.truelancer.com",
  "crowded": "https://www.crowded.com",
  "blender": "https://www.blender.org",
  "sketchup": "https://www.sketchup.com",
  "autodesk_maya": "https://www.autodesk.com/products/maya/overview",
  "autodesk_3ds_max": "https://www.autodesk.com/products/3ds-max/overview",
  "cinema_4d": "https://www.maxon.net/en/cinema-4d",
  "zbrush": "https://pixologic.com/zbrush/",
  "substance": "https://www.substance3d.com",
  "unity": "https://unity.com",
  "unreal_engine": "https://www.unrealengine.com",
  "turboSquid": "https://www.turbosquid.com",
  "cgtrader": "https://www.cgtrader.com",
  "sketchfab": "https://sketchfab.com",
  "3d_export": "https://3dexport.com",
  "blend_swap": "https://www.blendswap.com",
  "nse_india": "https://www.nseindia.com",
  "bse_india": "https://www.bseindia.com",
  "moneycontrol": "https://www.moneycontrol.com",
  "zerodha": "https://zerodha.com",
  "upstox": "https://www.upstox.com",
  "groww": "https://groww.in",
  "icicidirect": "https://www.icicidirect.com",
  "hdfc_securities": "https://www.hdfcsec.com",
  "angel_one": "https://www.angelone.in",
  "et_bricks": "https://bricks.etbricks.com",
  "tradingview": "https://www.tradingview.com",
  "investopedia": "https://www.investopedia.com",
  "e_trade": "https://www.etrade.com",
  "robinhood": "https://robinhood.com",
  "react documentation": "https://reactjs.org/docs/getting-started.html",
  "angular documentation": "https://angular.io/docs",
  "vue documentation": "https://vuejs.org/v2/guide/",
  "django documentation": "https://docs.djangoproject.com/en/stable/",
  "flask documentation": "https://flask.palletsprojects.com/en/latest/",
  "node js documentation": "https://nodejs.org/en/docs/",
  "svelte documentation": "https://svelte.dev/docs",
  "express documentation": "https://expressjs.com/en/4x/api.html",
  "jquery documentation": "https://api.jquery.com/",
  "bootstrap documentation": "https://getbootstrap.com/docs/5.1/getting-started/introduction/",
  "tailwindcss documentation": "https://tailwindcss.com/docs",
  "spring documentation": "https://spring.io/projects/spring-framework#learn",
  "java documentation": "https://docs.oracle.com/javase/8/docs/",
  "python documentation": "https://docs.python.org/3/",
  "csharp documentation": "https://docs.microsoft.com/en-us/dotnet/csharp/",
  "ruby documentation": "https://ruby-doc.org/",
  "php documentation": "https://www.php.net/manual/en/",
  "swift documentation": "https://developer.apple.com/documentation/swift",
  "typescript documentation": "https://www.typescriptlang.org/docs/",
  "go documentation": "https://golang.org/doc/",
  "rust documentation": "https://doc.rust-lang.org/book/",
  "kotlin documentation": "https://kotlinlang.org/docs/home.html",
  "scala documentation": "https://docs.scala-lang.org/",
  "html5 documentation": "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5",
  "css3 documentation": "https://developer.mozilla.org/en-US/docs/Web/CSS",
  "sql documentation": "https://www.sqlitetutorial.net/sqlite-cheat-sheet/",
  "graphql documentation": "https://graphql.org/learn/",
  "c documentation": "https://en.cppreference.com/w/c",
  "c++ documentation": "https://en.cppreference.com/w/cpp",
  "android documentation": "https://developer.android.com/docs",
  "ios documentation": "https://developer.apple.com/documentation/",
  "flutter documentation": "https://flutter.dev/docs",
  "xamarin documentation": "https://learn.microsoft.com/en-us/xamarin/",
  "unity documentation": "https://docs.unity3d.com/Manual/index.html",
  "unreal engine documentation": "https://docs.unrealengine.com/",
  "godot documentation": "https://docs.godotengine.org/en/stable/",
  "ethereum documentation": "https://ethereum.org/en/developers/docs/",
  "solidity documentation": "https://docs.soliditylang.org/",
  "hyperledger fabric documentation": "https://hyperledger-fabric.readthedocs.io/en/latest/",
  "truffle documentation": "https://www.trufflesuite.com/docs",
  "aws documentation": "https://docs.aws.amazon.com/",
  "azure documentation": "https://learn.microsoft.com/en-us/azure/",
  "google cloud documentation": "https://cloud.google.com/docs",
  "IBM cloud documentation": "https://cloud.ibm.com/docs",
  "aws iot documentation": "https://docs.aws.amazon.com/iot/latest/developerguide/what-is-iot.html",
  "azure iot documentation": "https://learn.microsoft.com/en-us/azure/iot-hub/",
  "google cloud iot documentation": "https://cloud.google.com/solutions/iot",
  "mqtt documentation": "https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html",
  "systems engineering handbook": "https://www.sebokwiki.org/wiki/SysML",
  "INCOSE handbook": "https://www.incose.org/products-and-publications/incose-handbook",
  "linux kernel documentation": "https://www.kernel.org/doc/html/latest/",
  "gnu documentation": "https://www.gnu.org/manual/manual.html",
  "clang documentation": "https://clang.llvm.org/docs/index.html",
  "tensorflow documentation": "https://www.tensorflow.org/learn",
  "pytorch documentation": "https://pytorch.org/docs/stable/index.html",
  "scikit-learn documentation": "https://scikit-learn.org/stable/user_guide.html",
  "keras documentation": "https://keras.io/api/",
  "openai documentation": "https://beta.openai.com/docs/",
  "google ai documentation": "https://ai.google/education/",
  "deepmind documentation": "https://deepmind.com/research",
  "IBM watson documentation": "https://cloud.ibm.com/docs/watson",
  "docker documentation": "https://docs.docker.com/",
  "kubernetes documentation": "https://kubernetes.io/docs/",
  "jenkins documentation": "https://www.jenkins.io/doc/",
  "ansible documentation": "https://docs.ansible.com/ansible/latest/index.html",
  "puppet documentation": "https://puppet.com/docs/puppet/latest/puppet_index.html",
  "chef documentation": "https://docs.chef.io/",
  "saltstack documentation": "https://docs.saltproject.io/en/latest/",
  "terraform documentation": "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs",
  "ncbi ": "https://www.ncbi.nlm.nih.gov/books/NBK279396/",
  "nature ": "https://www.nature.com/subjects/biology",
  "cell biology ": "https://www.cell.com/cell-biology",
  "genome biology ": "https://genomebiology.biomedcentral.com/articles",
  "apa style ": "https://apastyle.apa.org/",
  "psychology today": "https://www.psychologytoday.com/us",
  "journal of psychology": "https://www.tandfonline.com/toc/vpsp20/current",
  "behavioral science ": "https://www.springer.com/journal/12671",
  "legal information institute": "https://www.law.cornell.edu/",
  "findlaw documentation": "https://www.findlaw.com/",
  "harvard law review": "https://harvardlawreview.org/",
  "westlaw documentation": "https://legal.thomsonreuters.com/en/westlaw.html"

};

function handleCommand(command) {
  const lowerCommand = command.toLowerCase();
  
  const match = lowerCommand.match(/open\s+(\w+)/);
  if (match) {
    const websiteName = match[1].trim();
    if (commonWebsites[websiteName]) {
      window.open(commonWebsites[websiteName], "_blank");
      return; 
    } else {
      return;
    }
  }
  
  const arithmeticMatch = lowerCommand.match(/(\d+)\s*[+-/x%]\s*(\d+)/);
  if (arithmeticMatch) {
    const operand1 = parseInt(arithmeticMatch[1]);
    const operand2 = parseInt(arithmeticMatch[2]);

    if (lowerCommand.includes('+')) {
      p.textContent = `=> ${add(operand1, operand2)}`;
    } else if (lowerCommand.includes('-')) {
      p.textContent = `=> ${subtract(operand1, operand2)}`;
    } else if (lowerCommand.includes('/')) {
      p.textContent = `=> ${divide(operand1, operand2)}`;
    } else if (lowerCommand.includes('x')) {
      p.textContent = `=> ${multiply(operand1, operand2)}`;
    } else if (lowerCommand.includes('%')) {
      p.textContent = `=> ${modulo(operand1, operand2)}`;
    }
  }
}

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function divide(a, b) { return a / b; }
function multiply(a, b) { return a * b; }
function modulo(a, b) { return a % b; }

function sendTranscriptToBackend(transcript) {
  socket.emit('user_voice_input', { transcript });
}

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0].transcript).join('');
  p.textContent = transcript;

  if (e.results[0].isFinal) {
    handleCommand(transcript);
    
    // Send the transcript to the backend for processing
    sendTranscriptToBackend(transcript);

    p = document.createElement('p');
    words.appendChild(p);
    autoScroll();

    // Stop the wave animation when speech recognition is done
    waveContainer.style.display = 'none';
  }
  console.log(transcript);
});

recognition.addEventListener('end', () => {
  if (isRecognitionActive) {
    recognition.start();
  }
});

const speak = document.createElement('button');
speak.textContent = 'Speak';
speak.classList.add('speak');
document.body.appendChild(speak);

speak.addEventListener('click', () => {
  if (isRecognitionActive) {
    recognition.stop();
    isRecognitionActive = false;
    speak.textContent = 'Speak';
    waveContainer.style.display = 'none';
  } else {
    recognition.start();
    isRecognitionActive = true;
    speak.textContent = 'Stop';
    waveContainer.style.display = 'flex';
  }
});

// Listen for the response from the backend
socket.on('python_response', function(data) {
  console.log('Received response:', data.text);
  p.textContent = data.text;
});
