<!dOCtYPE hTMl>
<html lang="en">
    <head>
        <title>Tutorial</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0">

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
			<a id="navMusic" href="music/projects.php">Projects</a> 
			<a id="navRegister" href="register.php">Register</a>
			<a id="navLogin" href="login.php">Login</a>
			<a id="navAstley" href="https://www.youtube.com/watch?v=doEqUhFiQS4">Documentation of my development process</a>
			<a id="navLogout" onclick="logout()">Logout</a>
		</div>

        <div id="contentStart"></div>

        <h1>Tutorial</h1>
        
        <hr>

        <h2>Piece composition</h2>
        <p>
			MusicComp has two primary functions, composition, and instrument creation, this section explains <br/>
		 	how to create compositions and use the note editor.</p>
        <hr/>
		<h2>The main screen</h2>
		<img src="/media/editor_window.png"/>
		<p>
			The editor page is the first major component of the system. On the leftmost part you can see the list <br/> 
			of instruments, each instrument has their own part, with their own notes to be played. In the image   <br/>
			above, there is only the default instrument, the default sine wave. These are added and edited in the <br/>
			instrument editor, here you can simply choose between the musical parts to edit or play back.         <br/>
			<br/>
			The middle of the screen is the actual notation, containing the notes which make up the piece.        <br/>
			<br/>
			On the very right there are buttons for adding or removing notes and rests. <br/>
		</p>
		<img src="/media/instrument_list.png"/>
		<p>
			The instrument editor is the second part, containing a list of all the instruments in all the pieces  <br/>
			you've made. Every piece has the option to add an instrument, and you can add or delete instruments at will. <br/>
			<br/>
		</p>
		<img id="ie" src="/media/instrument_editor.png"/>
		<p>
			This is the actual editor window, here you can see the current wave in the top display, and sliders to <br/>
			adjust various points that define the wave, by changing the location of these points you can alter the <br/>
			sound of the instrument. The sound is determined by the overtones, which you can see displayed on the  <br/>
			bottom display, next to the second render of the wave. <br/>
			<br/>
		</p>



		<hr/>
			
		<h1>Frequently Asked Questions</h1>

		<br/>
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
        
        <h1 onclick="window.location.href = '/music/projects.php';" style="cursor: pointer; text-decoration: underline;">NOW THAT YOU'RE EDUCATED, GO AND ENJOY!</h1>

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
