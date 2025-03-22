<!dOCtYPE hTMl>
<html>
	<head>
		<title> Musical experiments </title>

		<script src="/music/js/editorNotes.js"></script>
		<script src="/music/js/editorTools.js"></script>
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
			<button onclick="openBaseInfo()">Edit piece info</button>
			<button onclick="openInstrumentList()">Open Instrument List</button>
			<button id="nextPage" onclick="pageForward()"> &#x003E; </button>

			<div id="noteSelect" onclick="selectNote();">
				<button class="noteButton"> <p class="noclick" id="whole"> &#xE0A2; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D3; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D5; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D7; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1D9; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE1DB; </p></button>
				
				<button class="noteButton"> <p class="noclick" id="whole"> &#xE4E3; </p></button>
				<button class="noteButton"> <p class="noclick"> &#xE4E4; </p></button>
				<button class="noteButton"> <p class="noclick rest"> &#xE4E5; </p></button>
				<button class="noteButton"> <p class="noclick rest"> &#xE4E6; </p></button>
				<button class="noteButton"> <p class="noclick rest"> &#xE4E7; </p></button>
				<button class="noteButton"> <p class="noclick rest"> &#xE4E8; </p></button>
			</div>

		</center>
		<canvas id="notation" onclick="interpretClick()" onmousemove="moveGhost()"> </canvas>
		
		<div id="baseInfo">
			<center style="height: 100%">
				<div id="infoWindow">
					<h1>Edit info</h1>
					<hr/>
					<p id="infoError"></p>
					<input id="pieceName" placeholder="Name your project"/>
					<input id="bpm" placeholder="BPM"/>
					<br/>
					Key:
					<input id="key" placeholder="C" title="Also accepts int values from 0-11, 0 being C">
					<br/>
					Time signature:
					<input id="topTime" placeholder="4"> / <input id="bottomTime" placeholder="4">
					<br/>
					<button onclick="closeBaseInfo()">Cancel</button> <button onclick="resetBaseInfo()">Reset</button> <button onclick="editBaseInfo()">Submit</button>

				</div>
			</center>
		</div>

		<div id="instrumentList">
			<center style="height: 100%">
				<div id="instrumentWindow">
					<h1>Instruments</h1>
					<hr/>
					<p id="instrumentError"></p>
					<div id="instrumentList"></div>
				</div>
			</center>
		</div>
	</body>
</html>
