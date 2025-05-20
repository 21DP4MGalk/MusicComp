<!dOCtYPE hTMl>
<html>
	<head>
		<title> Musical experiments </title>
		<script src="/music/js/editorPlayback.js"></script>
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
			<a id="navInstruments" href="/music/instruments.php">Instrument manager</a>
		</div>

		<div id="contentStart"></div>

		<center>
			<button id="prevPage" onclick="pageBack()"> &#x003C; </button>
			<button onclick="audioCtx.resume()">Turn on audio</button>
			<button onclick="openBaseInfo()">Edit piece info</button>
			<button onclick="editBaseInfo(true)">Save work</button>
			<button id="nextPage" onclick="pageForward()"> &#x003E; </button>

			<div id="noteSelect" onclick="selectNote();">
				<button> <p class="noclick" id="whole"> &#xE0A2; </p></button>
				<button> <p class="noclick"> &#xE1D3; </p></button>
				<button> <p class="noclick"> &#xE1D5; </p></button>
				<button> <p class="noclick"> &#xE1D7; </p></button>
				<button> <p class="noclick"> &#xE1D9; </p></button>
				<button> <p class="noclick"> &#xE1DB; </p></button>
				
				<button> <p class="noclick" id="whole"> &#xE4E3; </p></button>
				<button> <p class="noclick"> &#xE4E4; </p></button>
				<button> <p class="noclick rest"> &#xE4E5; </p></button>
				<button> <p class="noclick rest"> &#xE4E6; </p></button>
				<button> <p class="noclick rest"> &#xE4E7; </p></button>
				<button> <p class="noclick rest"> &#xE4E8; </p></button>
			</div>
			<div id="noteFunctions">
				<button onclick="selectNote()" title="Delete note"> <p class="noclick rest"> &#x2715; </p></button>
				<button onclick="selectNote()" title="Make note flat"> <p class="noclick leland"> &#xE260;  </p> </button>
				<button onclick="selectNote()" title="Make note sharp"> <p class="noclick  leland"> &#xE262; </p> </button>
			</div>

		</center>
		<div id="mainTools">
			<div id="instrumentList">
				<h1>Instruments</h1>
				<button onclick="window.location.href = '/music/instruments.php'">Go to instrument editor</button>
				<p id="instrumentError"></p>
				<hr/>
				<div id="listElement"></div>
			</div>


			<canvas id="notation" onclick="interpretClick()" onmousemove="moveGhost()"> </canvas>
		</div>

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
					<button onclick="closeBaseInfo()">Cancel</button> <button onclick="openBaseInfo()">Reset</button> <button onclick="editBaseInfo()">Submit</button>

				</div>
			</center>
		</div>

	</body>
</html>
