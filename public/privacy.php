<!dOCtYPE hTMl>
<html lang="en">
    <head>
        <title>Privacy and cookies</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">

        <script src="/js/navbar.js"></script>
		<link rel="stylesheet" href="/css/navbar.css"/>
        <link rel="stylesheet" href="/css/global.css"/>
		<link rel="stylesheet" href="/css/privacy.css"/>
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
		
        <div id="contentStart"></div>
        <h1> THIS SITE USES COOKIES FOR YOUR LOGIN TOKEN </h1>
        <h4> So far that's it, you can check it yourself, I don't collect stuff.</h4>
        <h6> Your username, hashed password, email and the stuff you create here is also stored in the database and that's it.</h6>
        <p>If you don't trust me, go check the code out.</p>
        <a href="https://github.com/21DP4MGalk/MusicComp">My github</a>
        <p>Enjoy this pic stolen shamelessly from <a href="https://tesladownunder.com/">tesladownunder.com</a>, I really like it. All rights reserved by them obviously.</p>
        <!-- <p>Alternatively, enjoy <a href="https://vimm.net/vault/290">Duck Tales for the NES</a></p> -->
        <img src="https://tesladownunder.com/TeslaColorREDBilat00811000.jpg" alt="Picture of a man hooked up to a ladder via tesla coil, looks cool"/>
        
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
