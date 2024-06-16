<html>
	<head>
		<title>Login to our bad site</title>
		<script src="./src/js/login.js"></script>
		<link rel="stylesheet" href="./src/css/main.css">
	</head>
	<body>
		<iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>
		<h1> Log in to this glorious mess. </h1>
		<form method="POST" action="api/login.php" target="dummyframe">
			<input name="username" type="text" id="username" placeholder="Username"></input>
			<input name="password" type="password" id="password" placeholder="Password"></input>
			<input type="Submit" value="Log in">
			<a id="f_passwd" onclick="alert('Ain\'t that a shame')">Forgot password?</a>
		</form>
	</body>
</html>
