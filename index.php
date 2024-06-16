<html>
	<head>
		<link rel="stylesheet" href="./src/css/main.css">
		<style>
			input{
				pointer-events: none;
			}
			div#nav{
				display: box;
				background-color: #EFEFEF;
				width: 100%;
				height: 50px;
				position: fixed;
			}
			a{	
				display: box;
				margin-left: 25px;
				font-size: 20px;
			}
		</style>
	</head>
	<body>
		
		<div id="nav"> 
			<a href="music.php">Music Page</a> 
			<a href="register.php">Register</a>
			<a href="login.php">Login</a>
			<a href="https://www.youtube.com/watch?v=doEqUhFiQS4">Documentation of my development process</a>
			<a href="api/logout.php">Logout</a>
		</div>

<br> <br>

		<h1 align="center"> YOU ARE WELCOME!!!! </h1> <h6> JK you are 
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

		<hr>
		<br>
		<h2> Current development status. </h2>

		<p> Below you can observe all kinds of neat tidbits about the current
		progress of the development of this inglorious website. <br>
		Current progress: </p>

		<progress value=0.1>I AM SCREWED</progress> <br>
		<p> I AM SCREWED </p>
		<h3> Goals:</h3> <br>
		<p> Writing basic classical notation: </p> <input type="checkbox" checked>
		<p> Basic crud API: </p> <input type="checkbox" >
		<p> Login system: </p> <input type="checkbox" >
		<p> Witty pages: </p> <input type="checkbox" >
		<p> Modern UI: </p> <input type="checkbox" >
		<p> Horribly outdated UI: </p> <input type="checkbox" checked>
	
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
		    "The song is too cliché, start again from scratch" - <i> Asher Gricman </i>
		</blockquote>
	</body>
</html>
