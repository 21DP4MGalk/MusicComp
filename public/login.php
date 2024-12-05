<!dOCtYPE hTMl>
<html lang="en">
	<head>
		<title>Log in to our bad site</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<script src="/js/login.js"></script>
		<script src="/js/navbar.js"></script>
		<link rel="stylesheet" href="/css/global.css">
		<link rel="stylesheet" href="/css/register.css">
		<link rel="stylesheet" href="/css/navbar.css">
		<link rel="stylesheet" href="/css/footer.css"/>
	</head>
	<body>

		<div id="nav"> 
			<a id="navHome" href="index.php">Home</a>
			<a id="navMusic" href="music/projects.php">Music Page</a> 
			<a id="navRegister" href="register.php">Register</a>
			<a id="navLogin" href="login.php">Login</a>
			<a id="navAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Documentation of my development process</a>
			<a id="navLogout" onclick="logout()">Logout</a>
		</div>

		<div style="margin-top: 60px"></div>
		<div id="registrationForm">
			<h1 align="center"> Log in to our ranks </h1>
			<div id="inputFields">
				<p class="fieldNames">Username: </p><input id="username" placeholder="Enter your username or email"/> <br><br>
				<p class="fieldNames">Password:</p><input id="password" type="password" placeholder="Enter a password, at least 12 characters"/> <br><br>
				<p id="error"></p>
			</div>
			<button id="submit" onclick="submitLoginForm()">Login</button>
		</div>
		<div id="success" style="display: none;">
			<h1>Login successful!</h1>
		</div>

		<div id="footer">
			<div id="footerPages">
				<p class="footerHeader">Main links:</p>
				<p class="footerContent">
					<a id="footHome" href="index.php">Home</a>
					<a id="footMusic" href="music.php">Music Page</a> <br>
					<a id="footRegister" href="register.php">Register</a>
					<a id="footLogin" href="login.php">Login</a> <br>
					<a id="footLogout" onclick="logout()">Logout</a> <br>
				</p>
			</div>
			<hr>
			<div id="footerLinks">
				<p class="footerHeader">Additional links:</p>
				<p class="footerContent">
					<a id="footAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Not Rick Astley</a>
					<a id="footPrivacy" href="privacy.php">Privacy & Cookies</a> <br>
					<a id="footRepo" href="https://github.com/21DP4MGalk/MusicComp">Repository</a> 
					<a id="footLicense" href="license.php">License</a> <br>
					<a id="footRealLicense" href="LICENSE.txt">Actual license</a>
					<a id="footTutorial" href="tutorial.php">Tutorial</a> <br>
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