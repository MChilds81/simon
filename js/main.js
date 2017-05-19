//this is a constructor of a color object that has a string ID
//which is the color name and has an Audio object connected to
//an associated sound file
function Color(ID, audioFile) {
	this.ID = ID
	this.audioFile = new Audio(audioFile)
}
//variable determines the time between consecutive lights in
//a sequence
var lightTime = 1, limitTime = 2
var colorArray, stillAlive, correct, sequenceNumber, lose, levelUp

//this variable is an audio object that plays when the player
//loses
lose = new Audio("audio/lose.mp3")
//this variable is an audio object that plays when the player
//beats levels of multiples of 5
levelUp = new Audio("audio/level-up.mp3")
//these initialize all 4 color objects for the buttons on the 
//game face
var greenObject = new Color("green", "audio/green.mp3")
var redObject = new Color("red", "audio/red.mp3")
var yellowObject = new Color("yellow", "audio/yellow.mp3")
var blueObject = new Color("blue", "audio/blue.mp3")
//this is a function that takes in a color and turns the light
//on for the corresponding button on the game face
function LightOn(color) {
	document.getElementById(color.ID).style.display = "none"
	//shows a picture on top of the game face that looks like
	//the button only lit up
	document.getElementById(color.ID).style.display = "unset"
	//calls the function to turn off the corresponding light 
	//after 1/2 the time between corresponding lights firing
	setTimeout(LightsOff,(lightTime*500),color)
}
//this function plays the sound for the corresponding color
function SoundOn(color) {
	color.audioFile.currentTime = 0
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
	var i = 0;
	LightOn(array[i])
	SoundOn(array[i])
	setInterval(function() {
	  i++;
	  if (i < array.length) {
	    LightOn(array[i])
	    SoundOn(array[i])
	  }
	}, 800)
	setTimeout(TimeLimit, (limitTime*1000)+(array.length*lightTime*1000),
	 (function(tempSequenceNumber){return tempSequenceNumber}(sequenceNumber)),
	 (function(tempCorrect){return tempCorrect}(correct)))
}
//this returns all parts of the game back to the beginning
function NewGame() {
	document.getElementById("lose").classList.remove("bounceInUp")
	document.getElementById("lose").style.display = "none"
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
	document.getElementById("lose").classList.add("bounceInUp")
	document.getElementById("lose").style.display = "unset"
	stillAlive = false
	lose.play()
	LightOn(greenObject)
	LightOn(redObject)
	LightOn(yellowObject)
	LightOn(blueObject)
	var i = 0;
	setInterval(function() {
	  i++;
	  if (i < 7) {
	    LightOn(greenObject)
		LightOn(redObject)
		LightOn(yellowObject)
		LightOn(blueObject)
	  }
	}, 1000)
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
				if(correct%5 === 0) {
					setTimeout(function() {
						levelUp.play();
						document.getElementById("counter").classList.add("rubberBand")
					}, 500)
					setTimeout(function() {
						Playback(colorArray);
						document.getElementById("counter").classList.remove("rubberBand")
					}, lightTime*4000)
				}
				else {
					setTimeout(Playback, lightTime*1500, colorArray)
				}
				return
			}
			//not the last light in sequence? then we'll check the next
			//sequence light in the sequence
			else {
				sequenceNumber++
				setTimeout(TimeLimit, (limitTime*1000), 
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