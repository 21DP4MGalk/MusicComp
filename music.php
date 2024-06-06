<!DOCTYPE HTML>
<html>
	<head>
		<title> Musical experiments </title>
		<script src="./src/js/music.js"></script>
		<link rel="stylesheet" href="./src/css/main.css"></style>
	</head>
	<body onload="initCtx()">
		<center>
			<button onclick="audioCtx.resume()">START</button>
			<select id="noteSelect">
				<option value="E0A2">whole</option>
				<option value="E1D3">half</option>
				<option value="E1D5">quarter</option>
				<option value="E1D7">eighth</option>
				<option value="E1D9">sixteenth</option>
				<option value="E1DB">thirty-second</option>

				
				<option value="E4E3">whole rest</option>
				<option value="E4E4">half r</option>
				<option value="E4E5">quarter r</option>
				<option value="E4E6">eighth r</option>
				<option value="E4E7">sixteenth r</option>
				<option value="E4E8">thirty-second r</option>
			</select>
			<canvas id="notation" onclick="interpretClick()" width="1800px" height="1080px"> </canvas>

		</center>
	</body>
</html>
