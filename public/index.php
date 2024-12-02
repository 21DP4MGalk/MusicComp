<html>
	<head>
		<script src="/js/navbar.js"></script>
		<script src="/js/index.js"></script>
		<link rel="stylesheet" href="/css/navbar.css"/>
		<link rel="stylesheet" href="/css/index.css"/>
		<link rel="stylesheet" href="/css/global.css"/>
	</head>
	<body onload="init()">
		<div id="nav"> 
			<a id="navIndex" href="index.php">Home</a>
			<a id="navMusic" href="music.php">Music Page</a> 
			<a id="navRegister" href="register.php">Register</a>
			<a id="navLogin" href="login.php">Login</a>
			<a id="navAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Documentation of my development process</a>
			<a id="navLogout" onclick="logout()">Logout</a>
		</div>
		<div id="contentStart"></div>
			<h1 align="center"> YOU ARE WELCOME!!!! </h1> 
			<h6 align="center"> JK you are 
			<?php 
			if(isset($_COOKIE["username"])){
				echo $_COOKIE["username"];
			}
			else{
				echo "an unregisterd pleb";
			}
			?> </h6>
			<p align="center"> Have you ever wondered, what it would be like, to bask <br>
				in the glory of a really janky and bad sequencer that runs<br>
				on the web, made by someone who does not know what he is<br>
				doing? I bet you have not, but this is exactly what I offer<br>
				to you, on my humble site. Feel free to register or attempt<br>
				SQL injections. I will gladly rip my hair out trying to undo<br>
				the damages, you scullywagger. Also I do not know what to put<br>
				here for now so I will add faux news. <br></p>
			<br>
			<hr>
			<br>
		
			<h2> Current development status. </h2>

			<p> Below you can observe all kinds of neat tidbits about the current
			progress of the development of this inglorious website. <br> <br>
			Current progress: </p>

			<progress value=0.1>Hey at least it looks kind of pretty</progress> <br>
			<p> I AM SCREWED </p>
			<div class="goals">
				<h3> Goals:</h3>
				<p> Rewrite the backend </p> <input type="checkbox"> <br>
				<p> Rewrite the music page: </p> <input type="checkbox"> <br>
				<p> Login system: </p> <input type="checkbox"> <br>
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
			have reported so far!. <br>

			<blockquote cite="Project founder and only developer">
				"Honestly this is the best thing to have happenned to me, <br>
				I've grown about 3 feet taller, my muscles have grown so <br>
				much that I am confident I could finally hit my gym goals, <br>
				attract all the ladies, scare off the jehovah's witnesses <br>
				and get a 10 in the exam. Your results may vary though, don't <br>
				sue me." - <i>Project founder and only developer</i>
			</blockquote>
		

			<pre>
			<blockquote cite="">
	"<?php require "api/getFortune.php"; ?>" - <i>Jerry</i>
			</blockquote>
			</pre>

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
				"Good shit, I like it, and not because I'm a paid actor." - <i> Aleksanya </i>
			</blockquote>
			
		<div id="fadeIn"></div>
	
	</body>
</html>
