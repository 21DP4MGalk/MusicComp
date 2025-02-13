<!dOCtYPE hTMl>
<html>
	<head>
		<title> Musical experiments </title>

		<script src="/music/js/editor.js"></script>
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
			<button id="prevPage" onclick="pageBack()"> &#x003C; </button>
			<button onclick="audioCtx.resume()">Turn on audio</button>
			<button id="nextPage" onclick="pageForward()"> &#x003E; </button>

			<div id="noteSelect" onclick="selectNote();">
				<button class="noteButton"> <p class="noclick" id="whole"> &#xE0A2; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D3; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D5; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D7; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D9; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1DB; </p></button>
			</div>

		</center>
			<canvas id="notation" onclick="interpretClick()" onmousemove="moveGhost()"> </canvas>

	</body>
</html>
