const a_context = new AudioContext();  
var oscillator;
var et12 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440, 466.16, 493.88];
var temperament = et12;
var concert_A = 440;

class Note{
	constructor(pitch, duration){ //float, float
		this.pitch = pitch;
		this.duration = duration;
	}
	playDrone(duration){	// in seconds
		oscillator = a_context.createOscillator();
		
		oscillator.type = document.getElementById('wave').value;
		oscillator.connect(a_context.destination);
		oscillator.frequency.value = this.pitch;

		oscillator.start();
		oscillator.stop(duration);
	}
}

class MusicSection{
	constructor(bpm, top_time, bottom_time){ //int, int, int
		this.bpm = bpm;
		this.top_time = top_time;
		this.bottom_time = bottom_time;
	}
}

class MusicTextReader{
	constructor(song, bpm, bottom_time){
		this.song = song;
		this.bpm = bpm;
		this.bottom_time = bottom_time;
	}
	
	playNote(note){
		oscillator = a_context.createOscillator();

		//oscillator.type = document.getElementById('wave').value;
		oscillator.frequency.value = note.pitch;
		//oscillator.detune = detune;
		console.log(note.duration * this.bottom_time * (60/this.bpm));
		oscillator.connect(a_context.destination);
 	   	oscillator.start();
		oscillator.stop(note.duration * this.bottom_time * (60/this.bpm));
	}

	playString(){
		var song_left = this.song;
		console.log(song_left, this.song);
		var cur_note = new Note(0, 0);
		var ascii = 0;

		for(var i = 0; i < song_left.length; i++){
			ascii = song_left[i].charCodeAt(0);
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
			console.log(song_left.length, i, i+1);
			if(ascii < 58 && ascii > 47){
				if(i+1 < song_left.length && song_left[i+1].charCodeAt(0) < 58 && song_left[i+1].charCodeAt(0) > 47){
					cur_note.pitch = temperament[parseInt(i+song_left[i+1], 10) % 12];
					this.playNote(cur_note);
				}
				else{
					cur_note.pitch = temperament[parseInt(i, 10)];
					this.playNote(cur_note);
				}
			}
			console.log('One loop done!');
		}
	}
}

function getContext(){
	var bpm = document.getElementById('').value;
	var top_time = document.getElementById('').value;
	var bottom_time = document.getElementById('').value;
	return MusicSection(bpm, top_time, bottom_time);
}

function getNote(){
	var pitch = document.getElementById('freq').value;
	var duration = document.getElementById('duration').value;
	var note = new Note(pitch, duration);
	return note;
}

function startDrone(){
	note = getNote();
	note.playDrone(document.getElementById('dur').value);
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
