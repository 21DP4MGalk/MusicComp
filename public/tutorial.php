<html>
    <head>
        <title>Tutorial</title>
        <script src="/js/navbar.js"></script>
        <script src="/js/tutorial.js"></script>
        <link rel="stylesheet" href="/css/global.css"/>
        <link rel="stylesheet" href="/css/navbar.css"/>
        <link rel="stylesheet" href="/css/tutorial.css"/>
		<link rel="stylesheet" href="/css/footer.css"/>
    </head>
    <body onload="init()">
        <div id="nav"> 
            <a id="navHome" href="index.php">Home</a>
			<a id="navMusic" href="music.php">Music Page</a> 
			<a id="navRegister" href="register.php">Register</a>
			<a id="navLogin" href="login.php">Login</a>
			<a id="navAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Documentation of my development process</a>
			<a id="navLogout" onclick="logout()">Logout</a>
		</div>

        <div id="contentStart"></div>

        <h1>Tutorial</h1>
        
        <hr>

        <h3>Congradulations on registering to our glorious website!</h3>
        <h6>Now sit down and Imma explain how this shit works in the form of an FAQ page</h6>
        

        <h2 class="section">"How do compose"</h2>
        <p class="explanation">I don't know, I'm not a composer</p>
        <h2 class="section">"How do delete accont"</h2>
        <p class="explanation">I don't know, I don't use my site</p>
        <h2 class="section">"How do publish composition"</h2>
        <p class="explanation">I don't know, I'm not a record store</p>
        <h2 class="section">"Can I go to the bathroom?"</h2>
        <p class="explanation">I don't know, CAN YOU?</p>
        <h2 class="section">"This site is mean I don't like it?"</h2>
        <p class="explanation">I don't know, I'm not</p>
        <h2 class="section">"Podman"</h2>
        <p class="explanation">compose</p>
        <h2 class="section">"I'm hungry"</h2> 
        <p class="explanation">Hi hungry, I'm dad!</p>
        <h2 class="section">"Who is Jerry?"</h2>
        <p class="explanation">Who are you talking about? I don't know any Jerries, not since we lost him.</p>

        <hr>
        <h1 onclick="window.location.href = 'index.php';" style="cursor: pointer; text-decoration: underline;">NOW THAT YOU'RE EDUCATED, GO AND ENJOY!</h1>

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
					<a id="footRealLicense" href="LICENSE.txt">Actual license</a> <br>
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