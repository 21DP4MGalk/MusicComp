<!dOCtYPE hTMl>
<html>
	<head>
		<title> Musical experiments </title>

		<script src="/music/js/editor.js"></script>
		<link rel="stylesheet" href="/css/global.css">
		<link rel="stylesheet" href="/css/navbar.css">
		<link rel="stylesheet" href="/css/footer.css">
		<link rel="stylesheet" href="/music/css/editor.css">
		<meta charset="utf-8">
			</head>
	<body onload="init()">
		<div id="nav"> 
			<a id="navHome" href="/index.php">Home</a>
			<a id="navProjects" href="/music/projects.php">Projects</a> 
			<a id="navEditor" href="/music/editor.php">Music editor</a>
			<a id="navInstruments" href="/music/instruments.php">Instrument manager</a>
		</div>

		<div id="contentStart"></div>

		<center>
			<button onclick="audioCtx.resume()">Turn on audio</button>

			<div id="noteSelect" onclick="selectNote();">
				<button class="noteButton"> <p class="noclick" id="whole"> &#xE0A2; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D3; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D5; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D7; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D9; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1DB; </p></button>
			</div>

			<input id="bpmtext" placeholder="BPM: 120"/>
			<button onclick="mainStaff.updateBPM()">Update BPM</button>
			<canvas id="notation" onclick="interpretClick()"> </canvas>

		</center>
	</body>
</html>
