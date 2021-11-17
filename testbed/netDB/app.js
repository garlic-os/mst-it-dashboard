var toast = function(message) {
	document.querySelector("#toast").MaterialSnackbar.showSnackbar({message: message});
}
var ajaxGet = function(url, callback) {
	var xhr;
         
    if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
        var versions = ["MSXML2.XmlHttp.5.0", 
                        "MSXML2.XmlHttp.4.0",
                        "MSXML2.XmlHttp.3.0", 
                        "MSXML2.XmlHttp.2.0",
                        "Microsoft.XmlHttp"]

         for(var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            }
            catch(e){}
         } // end for
    }
     
    xhr.onreadystatechange = ensureReadiness;
     
    function ensureReadiness() {
        if(xhr.readyState < 4) {
            return;
        }
         
        if(xhr.status !== 200) {
            return;
        }

        // all is well  
        if(xhr.readyState === 4) {
            callback(JSON.parse(xhr.responseText));
        }           
    }
     
    xhr.open('GET', url, true);
    xhr.send('');
}
var randomKey = function(obj) {
	var count = 0;
	for (var key in obj) {
		if(obj.hasOwnProperty(key)) count++;
	}
	var randIndex = Math.floor(Math.random() * count);
	for (var key in obj) {
		if(randIndex <= 0) {
			return key;
		}
		if(obj.hasOwnProperty(key)) randIndex--;
	}
}
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function togglePopup() {
	mainVue.toggleIframe();
}

var fbRef;
var store = {
	state: {
		msg: "login"
	},
	user: {
		nickname: null,
		fullname: null
	},
	updateState: function(newState) {
		this.state.msg = newState;
	},
	updateUser: function(nickname, fullname) {
		this.user.nickname = nickname;
		this.user.fullname = fullname;
	}
};

var welcomeVue = new Vue({
	el: "#loginCard",
	data: {
		state: store.state,
		nickname: localStorage.getItem('nickname')
	},
	computed: {
		userFullName: function() {
			return this.regFirst.trim() + " " + this.regLast.trim()
		},
		cleanRegPic: function() {
			return this.regPic.trim()
		},
		userNickname: function() {
			return this.nickname.replace(/\s+/g, '_')
		}
	},
	methods: {
		loginUser: function() {
			var self = this;
			if (!self.userNickname.length) {
				return;
			}
			// Successful Login
			self.validateUser(self.userNickname, function(isValid) {
				if (isValid) {
					self.postLogin();
				}
				else
					toast("Unable to find " + self.userNickname + ", maybe you need to register");
			});
		},
		validateUser: function(nickname, cb) {
			var self = this;
			fbRef = new Firebase("https://it-trivia.firebaseio.com/");
			fbRef.child('Users/' + nickname).once("value", function(snapshot){
				// Failure to login
				if(!snapshot.exists()) {
					cb(false);
				}
				else {
					store.updateUser(snapshot.key(), snapshot.val().fullname);
					cb(true);
				}
			});
		},
		regUser: function() {
			var self = this;
			if(!/^[\w]+$/.test(self.userNickname)) {
				toast("No special characters allowed in nickname");
				return;
			}
			else if(self.userNickname.length > 100) {
				toast("Your nickname is too long");
				return;
			}
			if(!self.userNickname || !self.regFirst || !self.regLast) {
				toast("All fields must be complete");
				return;
			}

			fbRef = new Firebase("https://it-trivia.firebaseio.com/");
			fbRef.child('Users/' + self.userNickname).set({
				fullname: self.userFullName,
				pic: self.cleanRegPic,
				score: 0
			}, function(){
				console.log("Successfully Created User");
				store.updateUser(self.userNickname, self.userFullName);
				self.postLogin();
			});
		},
		postLogin: function() {
			var self = this;
			localStorage.setItem('nickname', store.user.nickname);
			store.updateState("navigation");
			toast("Welcome: " + store.user.fullname);
			fbRef.child('Users/' + store.user.nickname + '/lastActive').set(Date.now());
			self.$emit('login');
		}
	}
});

var newQueVue = new Vue({
	el: "#newQueVueWrapper",
	data: {
		state: store.state,
		user: store.user
	},
	methods: {
		fabHandler: function() {
			var self = this;
			store.updateState(self.state.msg == "newQ" ? "navigation" : "newQ");
			self.reset();
		},
		newQSubmit: function() {
			var self = this;
			if(!self.formText || !self.formOpt1 || !self.formOpt2 || !self.formOpt3 || !self.formOpt4) {
				toast("All fields must be complete");
				return;
			}
			if(self.formText > 300) {
				toast("Question is way too long. Ain't nobody got time for that.");
				return;
			}

			// Lets do a lot of work to find long words
			var foundLongWords = false;
			[self.formText, self.formOpt1, self.formOpt2, self.formOpt3, self.formOpt4].forEach(function(text){
				// Go thru all word and look for really long ones too big to display on a single line
				var isTooLong = function(tooLong, word) {
					console.log(word);
					return word.length > 29 ? true : tooLong;
				}
				if (text.split(" ").reduce(isTooLong, false)) {
					toast("One of your words are just too long. Consider breaking it up with a space");
					foundLongWords = true;
				}
			});
			if (foundLongWords)
				return;

			var newQ = fbRef.child('Questions/' + self.catOption).push();
			newQ.set({
				text: self.formText,
				options: [self.formOpt1, self.formOpt2, self.formOpt3, self.formOpt4],
				author: self.user.fullname
			});
			fbRef.child('Answers/' + newQ.key()).set(self.formCorrect);
			fbRef.child('Users/' + self.user.nickname + '/questions').once("value", function(snap) {
				var newQnum = snap.exists() ? snap.val() + 1 : 1;
				fbRef.child('Users/' + self.user.nickname + '/questions').set(newQnum, function(){
					toast('Thanks for contributing!');
				});
			});
			fbRef.child('Users/' + self.user.nickname + '/score').once("value", function(snap){
				var newScore = snap.val() + 25;
				fbRef.child('Users/' + self.user.nickname + '/score').set(newScore);
			})
			store.updateState("navigation");
			self.reset();
		},
		reset: function() {
			var self = this;
			document.querySelector("#newQuestionCard #trivia_newq_text").value = null;
			for (var i = 1; i <= 4; i++) {
				self["formOpt" + i] = '';
				document.querySelector("#newQuestionCard #trivia_newq_" + i).value = null;
			}
		}
	}
});

var navigationVue = new Vue({
	el: "#navigationTabs",
	data: {
		state: store.state,
		user: store.user,
		users: {},
		matches: {},
		leaders: []
	},
	methods: {
		loadNav: function() {
			// This function called when an event fired by user logging in
			var self = this;
			// Create User List
			fbRef.child('Users').orderByChild('lastActive').limitToLast(50).on("child_added", function(snap){
				if (snap.key() != self.user.nickname) {
					self.$set('users.' + snap.key(), {
						primaryText: snap.val().fullname.split(" ")[0],
						img: snap.val().pic,
						subText: ""
					});
					// Yes I know this is so nasty but I didn't know what to do!!!!!
					window.setTimeout(function(){
						document.querySelector("#" + snap.key() + " .mdl-button").addEventListener("click", function(){
							self.playHandler(snap.key());
						});
					}, 250);
				}
			});
			// Track the matches
			fbRef.child('Users/' + self.user.nickname + '/matches').on('child_added', function(snap){
				self.matches[snap.val().opponent] = {id: snap.key()};

				//Only track currentTurn
				fbRef.child('Matches/' + snap.key() + '/currentTurn').on("value", function(matchChangeSnap){
					self.$set('users.' + snap.val().opponent + '.subText', matchChangeSnap.val() == self.user.nickname ? "Your Turn" : "Their Turn");
					self.matches[snap.val().opponent].currentTurn = matchChangeSnap.val();
				});
			});
			// Remove ended matches
			fbRef.child('Users/' + self.user.nickname + '/matches').on('child_removed', function(snap){
				self.$set('users.' + snap.val().opponent + '.subText', '');
				delete self.matches[snap.val().opponent];
			});
			// Display Notifications
			fbRef.child('Notifications/' + self.user.nickname).on("child_added", function(snap){
				fbRef.child('Notifications/' + self.user.nickname + '/' + snap.key()).remove();
				toast(snap.val().message);
			});
			// Track Leaders
			fbRef.child('Users').orderByChild('score').limitToLast(25).on("value", function(snap){
				var snapVal = snap.val();
				var sortable = [];
				for (key in snapVal) 
					sortable.push([key, snapVal[key].score]);
				sortable.sort(function(a, b){return a[1] - b[1]}).reverse();
				self.leaders = [];
				sortable.forEach(function(item) {
					self.leaders.push(snapVal[item[0]]);
				});
			});
		},
		playHandler: function(who) {
			var self = this;
			var foundMatch = false;

			//Begin search for an existing match
			for (var opponent in self.matches) {
				if (opponent == who) {
					foundMatch = self.matches[opponent].id;
					break;
				}
			}

			// Handle search results
			if (!foundMatch) {
				// Lets make a new match
				self.$emit('create_match', who);
			}
			else {
				if(self.matches[who].currentTurn == self.user.nickname){
					self.$emit('play', who, self.matches[who].id);
				}
				else {
					toast("Its not your turn yet buddy");
				}
			}
		}
	}
});

var quizVue = new Vue({
	el: "#answerQuestionCard",
	data: {
		state: store.state,
		user: store.user,
		questions: {
			Hardware: "",
			Networking: "",
			Tools: "",
			OS: ""
		},
		categoryTimeTable: {},
		title: '',
		text: '',
		author: '',
		options: [],
		selection: '',
		match: {
			id: "",
			opponent: "",
			question: "",
			timeLeft: 0,
			timer: 0
		}
	},
	methods: {
		loadQuestion: function(who, matchID) {
			// Ensure that nothing else is focused such as button they just selected to start match
			document.activeElement.blur();
			var self = this;

			// Store some date to be used later
			self.match.id = matchID;
			self.match.opponent = who;

			// Make sure noone is cheating
			if (window.localStorage.getItem(self.match.id)) {
				toast("Something weird happened... Maybe I caught you cheating ;)");
				window.localStorage.removeItem(self.match.id);
				self.updateMatch();
				return;
			}

			// Get a random category
			var category = ['Hardware', 'Networking', 'Tools', 'OS'][Math.floor(Math.random() * 4)];
			self.title = category;

			// Get all possible questions in that category
			self.getQuestionCategory(category, function() {
				
				// Choose a random question (i.e a random key of data)
				var Qid = randomKey(self.questions[category]);
				self.match.question = Qid;

				// Get the question
				fbRef.child('Questions/' + category + '/' + Qid).once('value', function(snap){
					//Initialize Question Field
					var Qdata = snap.val();
					self.text = Qdata.text;
					self.selection = null;

					// Add question options in random order
					var order = shuffle([1,2,3,4]);
					self.options = [];
					order.forEach(function(i) {
						self.options.push({value: i, text: Qdata.options[i-1]});
					});

					// Upgrade dynamic MDL elements
					// We have to wait for Vue to finish creating the elements or get errors galore
					setTimeout(function(){
						var radios = document.querySelectorAll("#answerQuestionCard .mdl-radio");
						if (radios.length < 4) {
							console.log("Couldn't upgrade the radios, must be slow computer");
						}
						else {
							for (var i = 0; i < 4; i++) {
								componentHandler.upgradeElement(radios[i]);
							}
						}
					},150);

					self.author = Qdata.author;

					// Minimum 10secs
					// Maximum 35secs
					// Maximum text length 300
					var qTime = 10 + Math.ceil((self.text.length/300)*25);
					console.log("You have,", qTime, "seconds to answer.");

					// Show Question to be answered
					store.updateState("quizzing");
					self.match.timeLeft = qTime;

					// Store time question started to check for cheaters later
					window.localStorage.setItem(self.match.id, Date.now());

					// Keep the pressure on with a timer
					self.match.timer = setInterval(function(){
						self.match.timeLeft -= qTime/100;
						document.querySelector("#qTimer").MaterialProgress.setProgress(self.match.timeLeft/qTime * 100);
						if (self.match.timeLeft <= 0) {
							clearInterval(self.match.timer);
							self.checkAnswer();
						}
					}, qTime*10);
				});
			});
		},
		getQuestionCategory: function(category, cb) {
			var self = this;
			// Only get the questions if you need them or if they are more 10 mins stale
			if (!(category in self.categoryTimeTable) || (Date.now() - self.categoryTimeTable[category]) > 60000) {
				ajaxGet("https://it-trivia.firebaseio.com/Questions/"+ category + ".json?shallow=true", function(data) {
					self.questions[category] = data;
					self.categoryTimeTable[category] = Date.now();
					cb();
				});
			}
			else {
				cb();
			}
		},
		checkAnswer: function() {
			var self = this;
			clearInterval(self.match.timer);

			// Verify the time to check for cheaters
			if(!window.localStorage.getItem(self.match.id) || (Date.now() - window.localStorage.getItem(self.match.id)) / 1000 > 40) {
				toast("Something weird happened... Maybe I caught you cheating ;)");
				self.updateMatch();
			}
			else {
				fbRef.child('Answers/' + self.match.question).once('value', function(ansSnap){
					if (ansSnap.val() == self.selection) {
						fbRef.child('Matches/' + self.match.id + '/' + self.user.nickname).once("value", function(matchSnap){
							var newScore = matchSnap.exists() ? matchSnap.val() +  1 : 1;
							fbRef.child('Matches/' + self.match.id + '/' + self.user.nickname).set(newScore, function(){
								// Yes this function is called regardless or correct or not but in this case it MUST be called 
								// after score has been successfully updated
								self.updateMatch();
							});
						});
					}
					else {
						self.updateMatch();
					}
					self.$emit('review', {
						text: self.text,
						isCorrect: ansSnap.val() == self.selection,
						correctText: self.options.filter(function(option){return option.value == ansSnap.val()})[0].text,
						usersAnswer: self.selection == null ? "" : self.options.filter(function(option){return option.value == self.selection})[0].text,
						author: self.author,
						question: self.match.question
					});
				});
			}

			// Regardless of cheating or not, clean up localStorage
			window.localStorage.removeItem(self.match.id);
		},
		createMatch: function(who) {
			var self = this;
			var matchRef = fbRef.child('Matches').push();
			self.match.id = matchRef.key();
			self.match.opponent = who;
			fbRef.child('Users/' + self.user.nickname + '/matches/' + self.match.id).set({opponent: who});
			fbRef.child('Users/' + who + '/matches/' + self.match.id).set({opponent: self.user.nickname});
			fbRef.child('Notifications/' + who).push().set({message: self.user.fullname.split(" ")[0] + " has initiated a match with you! Good Luck"});
			matchRef.set({currentTurn: self.user.nickname});
			self.loadQuestion(who, self.match.id);
		},
		updateMatch: function() {
			var self = this;
			fbRef.child('Matches/' + self.match.id + '/numAsked').once("value", function(askedSnap) {
				var numQasked = askedSnap.exists() ? askedSnap.val() + 1 : 1;
				// Can we determine a Winner?
				if (numQasked >= 8 && numQasked % 2 === 0) {
					fbRef.child('Matches/' + self.match.id).once("value", function(matchSnap){
						// You Won
						if ((matchSnap.val()[self.user.nickname] || 0) > (matchSnap.val()[self.match.opponent] || 0)) {
							self.updateScores(self.user.nickname, self.match.opponent);
						}
						// You Lost
						else if ((matchSnap.val()[self.user.nickname] || 0) < (matchSnap.val()[self.match.opponent] || 0)) {
							self.updateScores(self.match.opponent, self.user.nickname);
						}
						// Tied
						else {
							fbRef.child('Matches/' + self.match.id).update({currentTurn: self.match.opponent, numAsked: numQasked});
							fbRef.child('Notifications/' + self.match.opponent).push().set({
								message: 'You tied with ' + self.user.fullname.split(' ')[0] + ". OVERTIME!"
							});
						}
					});
				}
				else {
					fbRef.child('Matches/' + self.match.id).update({currentTurn: self.match.opponent, numAsked: numQasked});
					fbRef.child('Notifications/' + self.match.opponent).push().set({
						message: "Its your turn in your match against: " + self.user.fullname.split(" ")[0]
					});
				}
			});
		},
		updateScores: function(winner, losser) {
			var self = this;
			self.$emit('game_over', winner, losser);
			fbRef.child('Users/' + winner).once('value', function(snap){
				var newScore = snap.val().score ? snap.val().score + 100 : 100;
				var newGamesPlayed = snap.val().gamesPlayed ? snap.val().gamesPlayed + 1 : 1;
				fbRef.child('Users/' + winner).update({score: newScore, gamesPlayed: newGamesPlayed});
			});
			fbRef.child('Users/' + losser + '/gamesPlayed').once('value', function(snap){
				var newGamesPlayed = snap.exists() ? snap.val() + 1 : 1;
				fbRef.child('Users/' + losser + '/gamesPlayed').set(newGamesPlayed);
			});
			fbRef.child('Matches/' + self.match.id).remove();
			fbRef.child('Users/' + winner + '/matches/' + self.match.id).remove();
			fbRef.child('Users/' + losser + '/matches/' + self.match.id).remove();
		}
	}
});

var reviewVue = new Vue({
	el: "#reviewQuestionCard",
	data: {
		state: store.state,
		title: "",
		text: "",
		answer: "",
		yourAnswer: "",
		author: "",
		question: ""
	},
	methods: {
		loadReview: function(data) {
			var self = this;
			self.title = data.isCorrect ? "Correct" : "Incorrect";
			self.text = data.text;
			self.answer = data.correctText;
			self.author = data.author;
			self.question = data.question;
			self.yourAnswer = data.usersAnswer;
			store.updateState("reviewing");
		},
		closeReview: function() {
			store.updateState("navigation");
		},
		flagQuestion: function(e) {
			var self = this;
			e.preventDefault();
			fbRef.child('Flags/' + self.question + '/' + e.target.textContent).push().set(true);
			toast("Thanks for reporting");
		}
	}
});

var mainVue = new Vue({
	el: "main",
	data: {
		// We have to declare all the variables were going to use 
		//  so that Vue can setup data-binding properly
		analyzeUser: "",
		passReset: "",
		sccm: "",
		phone: "",
		netdbSearch: "",
		netdbRegUser: "",
		netdbRegMac: "",
		netgroups: netgroups,
		foundNetgroups: [],
		netgroup: "",
		netgroupUser: "",
		dell: "",
		stephen: "",
		people: "",
		turboPeople: ""
	},
	methods: {
		toggleIframe: function() {
			document.querySelector("#iframeCard").classList.toggle("disappear");
			// To make sure mdl is acting appropriately and everything looks nice :)
			this.fixFloatingLabels();
		},
		newIframe: function(title, url) {
			var self = this;
			document.activeElement.blur();
			setTimeout(function(){
				document.querySelector("#iframeCard .mdl-card__title-text").textContent = title;
				document.querySelector("#iframeCard iframe").method = 'get';
				document.querySelector("#iframeCard iframe").src = url;
				self.toggleIframe();
			}, 300);
		},
		handleAnalyzeUser: function() {
			// Check if all numbers, in which case use a different url
			var url = /^\d+$/.test(this.analyzeUser) ? "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_emplid&emplid="+this.analyzeUser+"&which=all" :
													   "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_userid&partial_userid="+this.analyzeUser+"&which=all";
			this.newIframe("Analyze User - Username or ID", url);
			this.analyzeUser = "";
		},
		handleAnalyzeLastName: function() {
			this.newIframe("Analyze User - Last Name", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_name&partial_name="+this.analyzeUser+"&which=all");
			this.analyzeUser = "";
		},
		handleAnalyzeEmail: function() {
			this.newIframe("Analyze User - Email", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/analyzer/analyze.pl?mode=search_email&email="+this.analyzeUser+"&which=all");
			this.analyzeUser = "";
		},
		handlePassReset: function() {
			this.newIframe("Knowledge Base", "https://kb.mst.edu/internal/search.php?q=" + this.passReset);
			this.passReset = "";
		},
		handleAdminPass: function() {
			window.open("https://password.umsystem.edu/MSTsupport");
		},
		handleSccmWin7: function() {
			this.newIframe("Web Template Generator - Win7","https://itweb.mst.edu/auth-cgi-bin/cgiwrap/deskwtg/generate.pl?mode=search&platform=win7-x64-sccm2012&host=" + this.sccm);
			this.sccm = "";
		},
		handleSccmWin10: function() {
			this.newIframe("Web Template Generator - Win10","https://itweb.mst.edu/auth-cgi-bin/cgiwrap/deskwtg/generate.pl?mode=search&platform=win10-x64-sccm2012&host=" + this.sccm);
			this.sccm = "";
		},
		handlePhone: function() {
			this.newIframe("Analyze Phone", "https://telcom.mst.edu/auth-cgi-bin/cgiwrap/mysofttools/analyze-number.pl?phone=" + this.phone);
			this.phone = "";
		},
		handleNetdb: function(mode) {
			if (mode == 'search'){
				this.netdbSearch = this.netdbSearch.replace(/\:/g, '');
				var url = /^[0-9A-Fa-f]{6}[0-9A-Fa-f]*$/.test(this.netdbSearch) ? "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byether&search=" + this.netdbSearch :
																				  "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byname&search=" + this.netdbSearch;
				this.newIframe("NetDB Search - Host or MAC", url);
			} else if (mode == 'owner') {
				this.newIframe("NetDB Search - Owner", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byowner&search=" + this.netdbSearch);
			} else if (mode == 'ip') {
				this.newIframe("NetDB Search - IP", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byip&search=" + this.netdbSearch);
			} else if (mode == 'location') {
				this.newIframe("NetDB Search - Location", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=byloc&search=" + this.netdbSearch);
			} else if (mode == 'description') {
				this.newIframe("NetDB Search - Description", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/search-hosts.pl?mode=bydesc&search=" + this.netdbSearch);
			} else if (mode == 'register') {
				this.newIframe("NetDB Register Standard", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner="+this.netdbRegUser+"&ether=" + this.netdbRegMac);
			} else if (mode == 'registertravel') {
				this.newIframe("NetDB Register Traveling", "https://itweb.mst.edu/auth-cgi-bin/cgiwrap/netdb/register-desktop.pl?owner="+this.netdbRegUser+"&nametype=travelname&ether=" + this.netdbRegMac);
			}
			
			this.netdbSearch = "";
			this.netdbRegUser = "";
			this.netdbRegMac = "";
		},
		handleNetgroupSearch: function() {
			var self = this;
			self.foundNetgroups = [];
			if (self.netgroup.length === 0)
				return;
			self.netgroups.forEach(function(netgroup) {
				if (netgroup.search(self.netgroup) !== -1 || netgroup.search(self.netgroup.toLowerCase()) !== -1) {
					self.foundNetgroups.push(netgroup);
				}
			});
		},
		handleNetgroupSelect: function(e) {
			this.netgroup = e.target.textContent;
			this.foundNetgroups = [];
		},
		handleDell: function() {
			this.newIframe("Dell Warranty", "http://www.dell.com/support/home/us/en/19/product-support/servicetag/" + this.dell);
			this.dell = "";
		},
		handleLaps: function() {
			this.newIframe("LAPS", "https://laps.mst.edu/auth-cgi-bin/cgiwrap/mstlaps/search.pl?query=" + this.laps);
			this.laps = "";
		},
		handleStephen: function() {
			toast("Stephen Says: " + this.stephen);
			this.stephen = "";
		},
		handlePeopleTurbo: function() {
			// Google does not allow cross-origin iframes
			window.open("https://www.google.com/contacts/u/0/#contacts/search/" + this.turboPeople.replace(/ /g, "+"));
			this.turboPeople = "";
		},
		handleForm: function(varToClear) {
			var self = this;
			this.toggleIframe();
			// We have to wait a split second or the model is updated before the form can be opened
			setTimeout(function(){
				if (varToClear instanceof Array) {
					for (item in varToClear) {
						self[varToClear[item]] = "";
					}
				} else
					self[varToClear] = "";
			}, 250);
		},
		modalToTab: function() {
			window.open(document.querySelector("#iframeCard iframe").src);
		},
		fixFloatingLabels: function() {
			console.log("Fixing labels");
			[].forEach.call(document.querySelectorAll(".mdl-textfield--floating-label.is-dirty"), function(el) {el.classList.remove('is-dirty')});
		}
	}
});

welcomeVue.$on('login', function(){
	navigationVue.loadNav();
});

navigationVue.$on('play', function(who, matchID) {
	quizVue.loadQuestion(who, matchID);
});

navigationVue.$on('create_match', function(who) {
	quizVue.createMatch(who);
});

// Necessary to do this with an event because the quizVue doesn't have access to user's fullnames
quizVue.$on('game_over', function(winner, losser) {
	var winnerFirstName, losserFirstName;
	if (winner in navigationVue.users) {
		winnerFirstName = navigationVue.users[winner].primaryText;
	}
	else {
		winnerFirstName = navigationVue.user.fullname.split(' ')[0];
	}

	if (losser in navigationVue.users) {
		losserFirstName = navigationVue.users[losser].primaryText;
	}
	else {
		losserFirstName = navigationVue.user.fullname.split(' ')[0];
	}
	fbRef.child('Notifications/' + winner).push().set({message: "You beat " + losserFirstName});
	fbRef.child('Notifications/' + losser).push().set({message: "You lost to " + winnerFirstName});
});

quizVue.$on('review', function(data) {
	reviewVue.loadReview(data);
})