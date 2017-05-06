//this is a constructor of a color object that has a string ID
//which is the color name and has an Audio object connected to
//an associated sound file
function Color(ID, audioFile) {
	this.ID = ID
	this.audioFile = new Audio(audioFile)
}
//variable determines the time between consecutive lights in
//a sequence
var lightTime = 1
var colorArray, stillAlive, correct, sequenceNumber, lose,
buttonPushed

//this variable is an audio object that plays when the player
//loses
lose = new Audio("audio/lose.mp3")
//these initialize all 4 color objects for the buttons on the 
//game face
var greenObject = new Color("green", "audio/green.mp3")
var redObject = new Color("red", "audio/red.mp3")
var yellowObject = new Color("yellow", "audio/yellow.mp3")
var blueObject = new Color("blue", "audio/blue.mp3")
//this is a function that takes in a color and turns the light
//on for the corresponding button on the game face
function LightOn(color) {
	//shows a picture on top of the game face that looks like
	//the button only lit up
	document.getElementById(color.ID).style.display = "unset"
	//calls the function to turn off the corresponding light 
	//after 1/2 the time between corresponding lights firing
	setTimeout(LightsOff,(lightTime*500),color)
}
//this function plays the sound for the corresponding color
function SoundOn(color) {
	color.audioFile.play()
}
//this function turns off the light
function LightsOff(color) {
	document.getElementById(color.ID).style.display = "none"
}
//this function returns a random color object
function RandomColor() {
	var myRandom = Math.floor(Math.random()*4)+1
	if(myRandom < 2) {
		return greenObject
	}
	else if(myRandom < 3) {
		return redObject
	}
	else if(myRandom < 4) {
		return yellowObject
	}
	else if(myRandom < 5) {
		return blueObject
	}
	else {
	}
}
//this function plays an array of color objects in order
//this is used to play the sequence before you guess
function Playback(array) {
	buttonPushed = true
	var i = 0;
	LightOn(array[i])
	SoundOn(array[i])
	buttonPushed = true
	setInterval(function() {
	  i++;
	  if (i < array.length) {
	    LightOn(array[i])
	    SoundOn(array[i])
	    buttonPushed[i] = true
	  }
	}, lightTime*1000)
	buttonPushed = false
	setTimeout(TimeLimit, 4000+(array.length*1000),
	 (function(tempSequenceNumber){return tempSequenceNumber}(sequenceNumber)),
	 (function(tempCorrect){return tempCorrect}(correct)))
}
//this returns all parts of the game back to the beginning
function NewGame() {
	//initially sets the colorArray to empty.  This will be filled
	//with color objects
	colorArray = []
	//this variable lets the game know if you lost or not
	stillAlive = true
	//initially sets which sequence number we are checking to 1
	sequenceNumber = 1
	//initially sets the counter to 0 and displays it
	correct = 0
	document.getElementById("counter").innerHTML = correct
	//puts the first random color into the sequence array
	//and then plays the sequence in order
	colorArray.push(RandomColor())
	Playback(colorArray)
	return
}
//this function ends the game and plays the losing music
function EndGame() {
	stillAlive = false
	LightOn(greenObject)
	LightOn(redObject)
	LightOn(yellowObject)
	LightOn(blueObject)
	lose.play()
	return
}
function TimeLimit(myNumber1, myNumber2) {
	if((sequenceNumber > myNumber1)||(correct > myNumber2)) {
		return
	}
	else {
		EndGame()
	}
}
//this function lets the user determine if his choices of 
//colors picked are correct with the array sequence of colors
function Check(color) {
	buttonPushed = true
	// console.log(buttonPushed)
	// console.log(sequenceNumber)
	LightOn(color); SoundOn(color);
	if (stillAlive) {
		//if guess is correct
		if (color.ID === colorArray[sequenceNumber-1].ID) {
			//if the correct guess is the last light in sequence
			if (sequenceNumber === colorArray.length) {
				//You win this level
				correct++
				document.getElementById("counter").innerHTML = correct
				sequenceNumber = 1
				colorArray.push(RandomColor())
				setTimeout(Playback, lightTime*1500, colorArray)
				return
			}
			//not the last light in sequence? then we'll check the next
			//sequence light in the sequence
			else {
				sequenceNumber++
				buttonPushed = false
				setTimeout(TimeLimit, 5000, 
	 			(function(tempSequenceNumber){return tempSequenceNumber}(sequenceNumber)),
	 			(function(tempCorrect){return tempCorrect}(correct)))
				return
			}
		}
		//guess is incorrect?
		else {
			EndGame()
			return
		}
	}
	else {
		return
	}
}
//these initialize all buttons and displays on load
document.getElementById("counter").innerHTML = correct
document.getElementById("greenButton").addEventListener("click", function() {Check(greenObject)})
document.getElementById("redButton").addEventListener("click", function() {Check(redObject)})
document.getElementById("yellowButton").addEventListener("click", function() {Check(yellowObject)})
document.getElementById("blueButton").addEventListener("click", function() {Check(blueObject)})
correct = 0
document.getElementById("counter").innerHTML = correct
document.getElementById("newGameButton").addEventListener("click", function() {NewGame()})