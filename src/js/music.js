const MainContext = new AudioContext();
var temperament = [261.6255653005985, 277.182630976872, 293.66476791740746, 311.1269837220808, 329.62755691286986, 349.2282314330038, 369.99442271163434, 391.99543598174927, 415.3046975799451, 440, 466.1637615180899, 493.8833012561241, 523.2511306011974];
var temperamentList = [[], []]; // NOTE: include 12tet, pythagorean, and some medieval ones, aswell as custom, of course.
var concertA = 440;

function getPitchGivenA(desiredPitchNum, referenceANum = 69, referenceA = 440){		
	// desiredPitchNum is the number assigned to the pitch we want to generate in a scale, for example how Middle C in MIDI format is 60
	// referenceANum is the number assigned to concert A in the same context, reference A defines concert A. 
	//All values should be INT
	if(isNaN(desiredPitchNum) || isNaN(referenceANum) || isNaN(referenceA)){
		throw new TypeError("One or more of of the parameters used for generating a pitched turned out not to be numbers, but rapscallions in trench coats!");
	}

	return (referenceA * (Math.pow( Math.pow(2, 1/12), (desiredPitchNum - referenceANum) ) ));
}

function getChromatic12TET(referenceA){
	if(isNaN(referenceA)){
		throw new TypeError("Concert A does not appear to be a number.");
	}
	
	tet12 = [];
	for(i = 0; i < 128; i++){
		tet12.push(getPitchGivenA(i, 69, referenceA));
	}
	return tet12;
}

class Note{
	constructor(pitch, duration){ //both must be numeric
		this.pitch = pitch;
		this.duration = duration;
	}
}

class MusicTextReader{
	constructor(song, bpm, bottom_time){
		this.song = song;
		this.bpm = bpm;
		this.bottom_time = bottom_time;
	}
	
	playNote(note, delay, attackTime = 0.1, releaseTime = 3){

		const oscillator = MainContext.createOscillator();
		oscillator.type = 'sine';
		oscillator.frequency.value = note.pitch;

		const gainModule = new GainNode(MainContext);
		gainModule.gain.cancelScheduledValues( MainContext.currentTime + delay);
		gainModule.gain.setValueAtTime(0, MainContext.currentTime + delay);
		gainModule.gain.linearRampToValueAtTime(1, MainContext.currentTime + delay + attackTime);
		gainModule.gain.linearRampToValueAtTime(0, MainContext.currentTime + delay + releaseTime);


		oscillator.connect(gainModule).connect(MainContext.destination);
 	   	oscillator.start( MainContext.currentTime + delay);
		oscillator.stop( MainContext.currentTime + delay + (note.duration * this.bottom_time * (60/this.bpm) ) );
	}

	playString(){

		var cur_note = new Note(0, 0);
		let ascii = 0;
		let delay = 0;

		for(var i = 0; i < this.song.length; i++){
			ascii = this.song[i].charCodeAt(0);
			console.log(ascii);

			switch(ascii){
				case 119:
					cur_note.duration = 1;
					break;
				case 104:
					cur_note.duration = 0.5;
					break;
				case 113:
					cur_note.duration = 0.25;
					break;
				case 115:
					cur_note.duration = 0.125;
					break;
			}
			
			if(ascii < 58 && ascii > 47){
				if(ascii == 48){
					console.log()
					cur_note.pitch = 0;
					console.log(ascii, i);

				}
				else{
					ascii = (parseInt( this.song.substring(i) )); 
					console.log(ascii, i);
					cur_note.pitch = temperament[ (ascii - 1) % temperament.length ];
					i += ascii.toString().length - 1;
					console.log(ascii, i);

				}
				console.log(cur_note);

				this.playNote(cur_note, delay);
				delay += (cur_note.duration * this.bottom_time * (60/this.bpm));
			}
			console.log('One loop done!');
		}
	}
}

class GrandStaff{
	constructor(bpm, bottomTime, topTime, smallestUnit, song = [[]]){
		this.bpm = bpm;
		this.bottomTime = bottomTime;
		this.topTime = topTime;
		this.smallestUnit = smallestUnit;
		generateEmptyStaff();
	}

	generateEmptyStaff(){
		emptynote = new Note(0, this.smallestUnit);
		//for(i = 0; i<)
	}
}

function testStringPlayer(){
	var reader = new MusicTextReader('s1s3s5s6s8s10s12s13q0h12q13s3s5s8s0s10s8s6s5s3', 60, 4);
	reader.playString();
}

function addNoteToStaff(){}

function refreshNotePosition(id){
	var staffLine = document.getElementById(id);
	var notes = document.getElementById(id + 'n');
	notes.style.top = ((staffLine.getBoundingClientRect().top + window.scrollY)) - 145 + 'px';	
}

function placeNoteStrings(){
	allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	allNums = ['1', '2', '3', '4'];
	for(i = 0; i < allLetters.length; i++){
		for(j = 0; j < allNums.length; j++){
			console.log(i, j);
			if( (i == 3 || i == 2) && (j == 0) || ((i == 0 || i == 1) && j==3 ) ){
				continue;
			}
			else{
				refreshNotePosition(allLetters[i] + allNums[j]);
			}
		}
	}
}

function getPointedElement(){ 
	var q = document.querySelectorAll(":hover"); 
	return q[q.length-1]; 
}

function interpretClick(){
	var staffLine = getPointedElement();
	console.log(staffLine.id);
	if(staffLine.id == "notation"){
		return;
	}
	else{
		var noteString = document.getElementById(staffLine.id + 'n');
		var selectedNote = document.getElementById('noteSelect');
		selectedNote = selectedNote.options[selectedNote.selectedIndex].value;
		console.log(selectedNote);
		//noteString.value += selectedNote + ' ';
		document.getElementById(staffLine.id + 'n').innerHTML += selectedNote + ' ';
	}
}


































































































































































































































































































































































/*			CAPYBARA JUMPSCARE
 
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢛⠃⣔⢦⠀⢈⢡⠑⣆⢂⡀⡘⠋⡀⣄⣒⠐⡄⠆⠀⢀⣤⣒⠤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⢤⣀⡘⢾⣭⢘⡾⣿⣾⣿⣿⣷⣿⣿⣯⣅⡷⠐⠐⢸⠉⠸⡷⢾⡷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⡂⢩⢶⡳⣶⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣟⣴⣽⡆⢏⣍⡘⣺⣽⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣌⠙⢹⣶⣒⡹⣯⡽⣿⣬⢷⣿⣿⣿⣿⣿⣿⣏⣿⣿⣭⡏⣬⣿⡼⠉⠉⠩⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠞⠁⠈⠠⢉⡷⢧⠘⣇⣹⣏⢻⣿⣷⣞⣯⣷⣿⣽⡿⢿⡿⣽⠻⣼⣏⡀⠀⠀⣈⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠶⣶⣴⣤⡴⠿⠏⢸⠝⣺⣯⣿⣿⡿⡿⢫⡽⣿⣿⢿⣿⣼⡷⣛⢿⣻⣵⣿⣿⡿⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠟⠁⠸⣓⡺⣾⣷⣿⡟⣟⠸⣇⣋⡱⢏⡿⣿⣿⣿⣿⢞⣿⢧⡹⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣛⣀⠀⢀⠃⠸⢇⡸⣿⣿⠣⠸⠃⠀⠀⠸⠛⠤⣛⣿⡿⣟⣻⣧⣟⣠⡜⣻⣇⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠦⠤⡠⠒⣶⠋⣙⢢⡳⠮⣿⣟⠀⠀⠀⠀⠀⠀⠀⠰⡹⢿⣱⠿⢟⣵⣉⢿⣧⡴⣬⠈⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⠂⠙⡁⣀⠴⠂⠅⠬⠉⠈⠀⠐⢒⠀⠀⠀⠀⢀⡀⠠⠀⡀⠉⡁⠈⠉⠠⢞⡚⠽⣻⣬⢷⡀⠽⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠤⠤⢀⢔⡨⢎⠁⠀⠀⠀⢀⣤⣭⣤⣰⣘⡴⣋⣶⣰⣧⣾⣿⣿⣦⡀⡼⢵⣯⣛⣩⡝⣿⣵⣎⣿⡷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢢⡾⣂⢋⡰⠇⣫⣜⣫⡄⠀⠀⠀⠸⠿⣿⡿⡙⣿⣷⣿⣿⣿⢿⣿⣿⣿⢏⡃⠀⢤⣼⣽⣽⣯⣽⣻⣭⣟⣿⣿⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣐⣷⡚⡱⠓⢶⣲⣗⣪⢷⡖⡢⠀⠀⡜⣃⠍⠀⠘⢻⣿⣿⣿⡯⢂⢩⣿⡥⢿⡀⢲⣺⣿⣿⣿⣽⣿⣽⣿⣿⢻⣯⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣍⣷⠟⢷⣯⠯⣱⣭⠟⡿⠓⠂⠀⠀⠀⠰⠛⠁⣰⢦⢹⣿⣳⢚⡥⠂⡟⠙⠟⠀⠀⣻⣿⢿⣾⣿⣿⣿⢿⣿⣿⣿⣿⣿⣦⠀⡄⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡯⢿⣿⣟⢟⣽⠿⠛⢣⣴⠣⠀⠀⠀⠀⠀⠄⠒⠉⢣⣿⡟⣶⣧⡿⣾⣝⡋⠹⠦⠀⠀⠶⣿⣿⣯⣻⣿⣿⣿⣿⣿⣿⣿⣯⢿⣮⡁⠀⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⢨⣶⣿⣟⣡⣬⡵⠖⡽⢇⡐⠭⠀⠀⠀⠀⠀⠀⠠⠶⣨⣷⣾⣷⣿⡽⡖⠠⠜⢀⠆⠀⠢⠖⢿⣵⣎⠿⢯⣿⣾⣿⡿⣿⣿⣿⣳⣼⡧⣄⠀⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⢋⣿⣷⣛⠴⣫⠄⣋⢸⡅⠄⠐⠀⠀⠀⠀⠀⠀⠀⠀⣱⠼⣿⣿⣿⡷⢋⡤⣄⠦⡙⢈⠑⠤⡀⠒⠿⣽⢶⣯⣿⣿⣽⣿⣿⣷⣿⣼⣿⡀⠉⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣊⡱⢎⣷⡽⠲⣯⣾⡷⠉⣒⠢⣢⡴⠀⠀⠀⠀⠀⠐⡀⠤⢻⣿⡟⠉⠂⠀⠈⠑⠡⣀⡑⢶⣬⣐⣾⣭⣦⣝⣭⣛⠿⣿⣽⡿⢿⣻⣿⣭⠁⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⠠⢴⡸⠋⢀⡿⢃⠀⢚⣩⣟⡴⠛⣥⠞⢋⠀⠄⠀⠀⠀⣀⠠⢃⢨⣳⣿⣽⣴⣆⣲⣍⣠⣁⠦⣘⣀⡻⣝⣾⣭⣽⣿⡷⢿⣿⣭⣛⣽⢫⢽⣿⡳⠄⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⢚⡵⢀⡁⠜⠢⣙⠤⡪⡡⣟⠉⣀⣠⡾⢏⠂⢊⣀⠔⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣯⣻⣷⣿⣧⣵⣿⣿⣯⢟⣿⢦⡟⠫⣤⣛⠾⣯⣟⣦⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠰⠈⢢⠴⠆⠠⠄⠀⠈⠒⣋⡴⢚⢟⣥⣆⡮⠸⠙⢋⠆⢻⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣧⣋⢿⣥⢻⣿⢿⣿⣿⣞⣛⢏⡙⣦⣈⠹⣿⣿⣿⡡⠀⠀⠀
⡇⠀⠀⠀⠀⠀⠀⠀⡄⠀⠂⢠⠀⠀⠀⠀⠐⠈⠘⣵⢫⣿⡏⡄⠁⣤⣾⢰⡎⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⡟⣦⣽⣾⣽⣿⣿⣽⣮⠓⡅⡌⢪⠋⣷⣦⣵⡟⣷⠁⠀⠀
⡇⠀⠀⠀⠀⠀⠠⣺⡉⡄⠒⠡⠤⡀⠀⠀⠀⠀⠠⠇⣹⡥⠞⠃⣼⣿⢧⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⢿⣾⢽⡋⢮⣍⠢⣍⠒⠬⣯⣝⣾⣿⣶⢃⠀⠀
⡇⠀⠀⠀⠀⠀⢰⡁⠀⢀⡴⡶⠍⠐⠀⠀⠀⠀⠀⡼⠋⡀⠀⣴⣻⣿⢹⣷⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣯⢿⣿⣻⣦⣽⣦⣬⣑⣦⣠⣤⣼⣿⣿⢯⣂⠀
⡇⠀⠀⠀⠀⠀⣠⢖⡬⠍⠶⠋⠠⣈⢀⠠⠀⡲⠏⠂⠔⣣⢜⣿⣽⢋⣾⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣞⣮⢾⣆⡙⢳⣟⣻⣿⣿⣿⡷⢶⡄
⡇⠀⠀⠀⠀⡘⠥⠷⡊⠥⢀⡴⠛⣐⣊⣰⢟⡵⢚⠾⠙⣫⣟⣋⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣻⣝⣛⣯⡗⢯⡹⢾⡿⣿⣿⣽⣿⣽⣛⠾
⡇⠀⠀⠄⠈⣠⡤⢊⠖⡹⠋⣠⡎⠽⢋⢕⡬⢴⣊⡾⢉⠟⢐⣣⣲⣼⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⡿⢯⣿⣹⣿⡽⠿⣶⣉⡞⣿⣽⡾⣟⣷
⣧⡀⠀⢀⠆⣵⠊⠱⠋⢟⢵⠋⡒⠧⣿⠏⡺⣽⠼⢟⠵⣮⢟⠻⣝⠿⢶⣻⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⡿⢻⣟⢷⣾⣛⣿⣽⣿⣿⣟⣾
⣿⣷⣤⣀⣚⠕⠫⡥⢀⠖⣀⡞⡹⢪⠡⠞⢟⡣⠼⢖⣫⡽⣋⡴⣽⠻⣟⣽⡾⣳⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣶⣹⣿⣬⣝⡺⢿⣾⢻⣿⣽⣾⣿
*/
