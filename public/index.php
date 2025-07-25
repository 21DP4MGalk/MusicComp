<!dOCtYPE hTMl>
<html lang="en">
	<head>
		<title> WELCOME TO MUSICCOMP!!!!!!!!</title>
	
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<script src="/js/navbar.js"></script>
		<script src="/js/index.js"></script>
		<link rel="stylesheet" href="/css/global.css"/>
		<link rel="stylesheet" href="/css/navbar.css"/>
		<link rel="stylesheet" href="/css/footer.css"/>
		<link rel="stylesheet" href="/css/index.css"/>
	</head>
	<body onload="init()">

		<noscript>
			<div id="noscript">
				<h1> Hey man </h1>
				<h3> I get it, I don't like JS either, not one bit, but ya gotta turn it on to view this page, sadly. </h3>
				<h5> If you don't trust me, there's always the option of checking the source code <a href="https://github.com/21DP4MGalk/MusicComp">here</a></h5>
			</div>
		</noscript>

		<div id="nav"> 
			<a id="navHome" href="index.php">Home</a>
			<a id="navMusic" href="music/projects.php">Music Page</a> 
			<a id="navRegister" href="register.php">Register</a>
			<a id="navLogin" href="login.php">Login</a>
			<a id="navAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Documentation of my development process</a>
			<a id="navLogout" onclick="logout()">Logout</a>
		</div>
		<div id="contentStart"></div>
			<h1 align="center"> Welcome to MusicComp! </h1> 
			<h6>Unaffiliated with <a href="https://music-comp.org/">Music-COMP</a></h6>

			<p align="center"> 
				MusicComp is a small-scale project build for personal satisfaction and out of necessity. <br>
				The goal is a sequencer that supports basic classical notation, aswell as custom instruments <br>
				created entirely by the user through a bezier curve editor. <br>
				The project idea is heavily inspired by <a href="https://dinisnoise.org/">DIN Is Noise</a>. <br>
				MusicComp admittedly is still quite rough around the edges, but the focus is on functionality and <br>
				simplicity rather than aesthetics. <br>
			</p>
			<br>
			<hr>
			<br>
		
			<h2> CURRENT DEVELOPMENT STATUS </h2>

			<p> As terms near the end, so does the development of this website, most of the major functions work, besides a few, but they're within soon workable status. <br>
			As improvements keep piling on, so do unexpected changes and realisations of the ridiculous choices I had made prior.
			<br> <br>
			Current progress: </p>

			<progress value=0.8>Hey at least it looks kind of pretty</progress> <br>
			<p> I AM actually not too SCREWED </p>
			<div class="goals">
				<h3> Goals:</h3>
				<p> Rewrite the backend </p> <input type="checkbox" checked> <br>
				<p> Rewrite the music page: </p> <input type="checkbox" checked> <br>
				<p> Login system: </p> <input type="checkbox" checked> <br>
				<p> Better UI: </p> <input type="checkbox"> <br>
			</div>
		
			<br>
			<hr>
			<br>
		
			<h2> SATISFIED CUSTOMER TESTIMONIALS </h2>
			<p> You're reading that right, despite our website <br>
			having an uptime of approximately 0 minutes on public servers, <br>
			we've decided to indulge in insider trading (legally a joke) <br>
			and we're more than happy to show off what our satisfied clients <br>
			have reported so far!. <br> <br>

			<blockquote cite="Project founder and only developer">
				"Honestly this is the best thing to have happenned to me, <br>
				I've grown about 3 feet taller, my muscles have grown so <br>
				much that I am confident I could finally hit my gym goals, <br>
				attract all the ladies, scare off the jehovah's witnesses <br>
				and get a 10 in the exam. Your results may vary though, don't <br>
				sue me." - <i>Project founder and only developer</i>
			</blockquote>


			<blockquote cite="">
	"<?php require "api/getFortune.php"; ?>" - <i>Jerry</i>
			</blockquote>

			<blockquote>
				"This is the most glorious thing I've ever seen." <br>
				- <i> I made this one up </i>
			</blockquote>
			
			<p> And now for quotes from our most honoured users, starting from the triple A indie developer of a hit tycoon game Business Road who chimed in to share his opinion on our product. </p>
			<blockquote>
				"Yeah, looks about right" - <i>Krister</i>
			</blockquote>

			<p> Next up on our list of high profile clients is the world-renown singer songwriter/guitarist know for such songs as _, , __. </p>
			<blockquote>
				"The song is too cliché, start again from scratch" - <i> Asher </i>
			</blockquote>

			<p>  </p>
			<blockquote>
				"Call me Sancho, for thou website hast noteworthty notes, capable of altering human society as a whole, I'm certainly certain that the Index would approve of such a donation to the society defined by the fingers, the thumb might not agree, however my response to that is "I have a gun"." - <i> Nils (verified owner of a scam site known as EchoAuctions) </i>
			</blockquote>
			
			<p>  </p>
			<blockquote>
				"Good shit, I like it, and not because I'm a paid actor." - <i> Aleksanya, unpaid actor </i>
			</blockquote>
			
		<div id="fadeIn"></div>

		

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
