const a_context = new AudioContext();  
var oscillator;

class Note{
	constructor(pitch, duration_div){ //float, float
		this.pitch = pitch;
		this.duration_div = duration_div;
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
	playNote(note){
		a_context.resume();
		oscillator = a_context.createOscillator();
		var detune = document.getElementById('bend').value;

		oscillator.type = document.getElementById('wave').value;
		oscillator.frequency.value = note.pitch;
		oscillator.detune = detune;

		oscillator.connect(a_context.destination);
 	   	oscillator.start();
		oscillator.stop();
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
