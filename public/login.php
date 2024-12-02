<html>
	<head>
		<title>Register to our bad site</title>
		<script src="/js/register.js"></script>
		<script src="/js/navbar.js"></script>
		<link rel="stylesheet" href="/css/global.css">
		<link rel="stylesheet" href="/css/register.css">
		<link rel="stylesheet" href="/css/navbar.css">
	</head>
	<body>

		<div id="nav"> 
			<a id="navMusic" href="music.php">Music Page</a> 
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
			<button id="submit" onclick="submitRegistrationForm()">Register</button>
		</div>
		<div id="success" style="display: none;">
			<h1>Registration successful!</h1>
		</div>
	</body>
</html>