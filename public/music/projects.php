<!dOCtYPE hTMl>
<html>
	<head>
		<title> Musical experiments </title>
		<script src="./js/projects.js"></script>
		<link rel="stylesheet" href="/css/global.css">
		<link rel="stylesheet" href="/css/navbar.css">
		<link rel="stylesheet" href="/css/footer.css">
		<link rel="stylesheet" href="/music/css/projects.css">
		<meta charset="utf-8">
	</head>
	<body onload="init()">
		<div id="nav"> 
			<a id="navHome" href="/index.php">Home</a>
			<a id="navProjects" href="/music/projects.php">Projects</a> 
			<a id="navEditor" href="/music/editor.php">Music editor</a>
			<a id="navInstruments" href="/music/instruments.php">Instrument manager</a>
		</div>
		<div id="toolBar">
			<button id="filters" onclick="filteringPopup()">Filtering</button>
			<input id="search"/>
			<button id="search" onclick="search()">Search</button>
			<button id="newPiece" onclick="newPiecePopup()">New piece</button>
		</div>
		<div id="pieces">
			<p id="error"></p>
		</div>


		<div id="newProject">
			<div id="creationDialog">
				<h1>New project</h1>
				<hr/>
				<p id="errorDialog"></p>
				<input id="pieceName" placeholder="Name your project"/>
				<input id="bpm" placeholder="BPM"/>
				<br/>
				Time signature:
				<input id="topTime" placeholder="4"> / <input id="bottomTime" placeholder="4">
				<br/>
				<button onclick="cancelNewProject()">Cancel</button> <button onclick="createNewProject()">Submit</button>
			</div>
		</div>

		<div id="footer">
			<div id="footerPages">
				<p class="footerHeader">Main links:</p>
				<p class="footerContent">
					<a id="footHome" href="/index.php">Home</a>
					<a id="footMusic" href="/music.php">Music Page</a> <br>
					<a id="footRegister" href="/register.php">Register</a>
					<a id="footLogin" href="/login.php">Login</a> <br>
					<a id="footLogout" onclick="logout()">Logout</a> <br>
				</p>
			</div>
			<hr>
			<div id="footerLinks">
				<p class="footerHeader">Additional links:</p>
				<p class="footerContent">
					<a id="footAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Not Rick Astley</a>
					<a id="footPrivacy" href="/privacy.php">Privacy & Cookies</a> <br>
					<a id="footRepo" href="https://github.com/21DP4MGalk/MusicComp">Repository</a> 
					<a id="footLicense" href="/license.php">License</a> <br>
					<a id="footRealLicense" href="/LICENSE.txt">Actual license</a> 
					<a id="footTutorial" href="/tutorial.php">Tutorial</a> <br>
				</p>	
			</div>
			<hr>
			<div id="footerContact">
				<p class="footerHeader">Contact:</p>
				<pre><p class="footerContent" style="padding-left: 10px;">Email: 14DPMGalkins@rvt.lv
Telephone: No
Address: Aiz maķīša
Your IP: <?php echo($_SERVER['REMOTE_ADDR'])?></p></pre>
			</div>
		</div>
	

    </body>
</html>
