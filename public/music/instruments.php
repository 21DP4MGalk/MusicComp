<!dOCtYPE hTMl>
<etml>
	<head>
		<title> Musical experiments </title>
		<script src="/music/js/instruments.js"></script>
		<script src="/music/js/fourier.js"></script>
		<link rel="stylesheet" href="/css/global.css">
		<link rel="stylesheet" href="/css/navbar.css">
		<link rel="stylesheet" href="/css/footer.css">
		<link rel="stylesheet" href="/music/css/instruments.css">
		<meta charset="utf-8">
	</head>
	<body onload="init()">
		<div id="nav"> 
			<a id="navHome" href="/index.php">Home</a>
			<a id="navProjects" href="/music/projects.php">Projects</a> 
			<a id="navInstruments" href="/music/instruments.php">Instrument manager</a>
		</div>

		<div id="contentStart"></div>
		
		<h1>Choose the instrument to edit</h1>
		<hr/>
		<p id="listError"></p>
		<div id="instrumentList">
		</div>
		
		<div id="curveEditor">
			<div id="editorWindow">
				<canvas id="curveDisplay"></canvas>
				<div id="coordinates">
					<label>Start point</label>
					<input type="range" id="sx" min="75" max="195" oninput="redrawCurve()"/>
					<input type="range" id="sy" min="-300" max="300" oninput="redrawCurve()"/>
					<hr>
					<label>Control point 1</label>
					<input type="range" id="c1x" min="75" max="195" oninput="redrawCurve()"/>
					<input type="range" id="c1y" min="-300" max="300" oninput="redrawCurve()"/>
					<hr>
					<label>Control point 2</label>
					<input type="range" id="c2x" min="75" max="195" oninput="redrawCurve()"/>
					<input type="range" id="c2y" min= "-300" max="300" oninput="redrawCurve()"/>
					<hr>
					<label>End point</label>
					<input type="range" id="ex" min="75" max="195" oninput="redrawCurve()"/>
					<input type="range" id="ey" min="-300" max="300" oninput="redrawCurve()"/>
				</div>
				<br>
				<button onclick="prevSegment()"> &#x003C; </button>
				<button onclick="closeEditor()">Close</button>
				<button onclick="deleteCurve()">Delete curve</button>
				<button onclick="saveWave()">Save waveform</button>
				<button onclick="drawFourier()">Render waveform</button>
				<button onclick="nextSegment()"> &#x003E; </button>
				<br>
				<canvas id="fourierDisplay" height="200px", width="600px"></canvas>
			</div>
		</div>

		<div id="instrumentAdd">
			<div id="instrumentAddWindow">
				<h2> Create new instrument </h2>
				<hr/>
				<label>Name</label> <input id="instrumentName"/> <br/>

				<label>Description</label> <input id="instrumentDescription"/> <br/>
				<p id="addError"></p>
				<button onclick="addInstrument()">Submit</button>
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
