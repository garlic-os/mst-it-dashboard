// JavaScript source code
// Tells Clippy to animate with a random animation.
function clippyRandom() {
    clearInterval(clippyRandom);
    agent.animate();
};

// Tells Clippy to run the trivia tip.
function clippyTriv() {
    clearInterval(clippyRandom);
    agent.speak("Did you know there is a trivia game just over there?");
    agent.play("GestureRight");
    clippyRan = setInterval(clippyRandom, 90000);
};

function clippyIsBored() {
    clearInterval(clippyRandom);
    agent.play("GetAttention");
    agent.speak("Hey! Do you even use this page?");
    agent.play("GetAttention");
};

// Method for checking for the cookie.
function checkCookie() {
    var first = getCookie("first");
    // If cookie exists
    if (first != "") {
        agent.moveTo(160, 100);
        agent.play("Show");
        agent.speak("Hello again!");
        agent.speak("I missed you so much!");
        agent.play("GetAttention");
        clippyRan = setInterval(clippyRandom, 90000);
        clippyBored = setTimeout(clippyIsBored, 300000);
    } else {
        setCookie("first", "first", 365);
        agent.show();
        agent.play("Greeting");
        agent.speak("Hello! I'm clippy, your virtual assistant!");
        agent.play("Wave");
        agent.speak("You can move me anywhere by clicking on me and dragging me!");
        agent.speak("Or...");
        agent.play("Hide");
        agent.moveTo(160, 110);
        agent.play("Show");
        agent.speak("I think I'll put myself right here. It's out of your way.");
        agent.play("GestureDown");
        agent.speak("Unless you like clicking in this blank space...");
        agent.play("Explain");
        agent.speak("Which ... I mean ... Whatever...");
        agent.play("RestPose");

    }
};

// Set the cookie.
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

// Get the cookie.
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};