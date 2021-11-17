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
		title: '',
		text: '',
		author: '',
		option1: '',
		option2: '',
		option3: '',
		option4: '',
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
			var self = this;
			self.match.id = matchID;
			self.match.opponent = who;
			if (window.localStorage.getItem(self.match.id)) {
				toast("Something weird happened... Maybe I caught you cheating ;)");
				window.localStorage.removeItem(self.match.id);
				self.updateMatch();
				return;
			}
			var category = ['Hardware', 'Networking', 'Tools', 'OS'][Math.floor(Math.random() * 4)];
			self.title = category;
			ajaxGet("https://it-trivia.firebaseio.com/Questions/"+ category + ".json?shallow=true", function(data) {
				var Qid = randomKey(data);
				self.match.question = Qid;
				fbRef.child('Questions/' + category + '/' + Qid).once('value', function(snap){
					var Qdata = snap.val();
					self.text = Qdata.text;
					for (var i = 1; i <= 4; i++) {
						self["option" + i] = Qdata.options[i-1];
					}
					self.author = Qdata.author;
				});
			});
			store.updateState("quizzing");
			self.match.timeLeft = 25;
			window.localStorage.setItem(self.match.id, Date.now());
			self.match.timer = setInterval(function(){
				self.match.timeLeft -= .25;
				document.querySelector("#qTimer").MaterialProgress.setProgress(self.match.timeLeft/25 * 100);
				if (self.match.timeLeft == 0) {
					clearInterval(self.match.timer);
					self.checkAnswer();
				}
			}, 250);
		},
		checkAnswer: function() {
			var self = this;
			clearInterval(self.match.timer);
			console.log("It took you", (Date.now() - window.localStorage.getItem(self.match.id)) / 1000, "seconds to answer");
			if(!window.localStorage.getItem(self.match.id) || (Date.now() - window.localStorage.getItem(self.match.id)) / 1000 > 26) {
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
						correctText: self["option" + ansSnap.val()],
						author: self.author,
						question: self.match.question
					});
				});
			}
			window.localStorage.removeItem(self.match.id);
		},
		createMatch: function(who) {
			var self = this;
			var matchRef = fbRef.child('Matches').push()
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