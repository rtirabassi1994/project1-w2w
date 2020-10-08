var divCont = $(".container");
var divCol = $("<div class='col-12'>");

var inputText = $("<input type='text' placeholder='Title of movie/TV show'>");
inputText.attr("id","inputTextMovie")
inputText.addClass("utellyInput");
var btn = $("<button id='submit'>Submit</button>");
var utellyResponse = $("<p id='utellyResponse'>");

var selectBody = $(".select-body");
var divTrailer;
var divMovieInfo;

var randomId;


divCont.append(inputText);
divCont.append(btn);
divCont.append(utellyResponse);

$("#submit").on("click", utellyFunction);

$("#inputTextMovie").on("keyup",function(event){
	if(event.keyCode === 13) {

		$("#submit").click();
	}
});

function utellyFunction(){
	
	$(divTrailer).remove();
	$(divMovieInfo).remove();
	utellyResponse.empty();


	var movieTitle = inputText.val();

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=" + movieTitle + "&country=us",
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
			"x-rapidapi-key": "1fb5bf74ddmsh5f6ba0a2a786e4bp19be3ejsn84732bde066a"
		}
	}


	$.ajax(settings).done(function (response) {
		console.log(response);

		if(response.results.length == 0) {
			alert("hello");
			return;
		}
		console.log(response.results.length);

		for(var i = 0; i < response.results.length; i++) {
			var movieTitle = response.results[i].name;

			if(!response.results[i].external_ids.imdb) {
				// alert("there is no imdb id");
			}

			else {
			var imdbId = response.results[i].external_ids.imdb.id;
			var imgLink = response.results[i].picture;
			var imgPoster = $("<img>");
			imgPoster.addClass("img-poster");
			imgPoster.attr("src",imgLink);
			var posterCaption = $("<p>"+movieTitle+"</p>")
			posterCaption.addClass("poster-text");

			var movieBtn = $("<button>").html(imgPoster);
			movieBtn.addClass('btn-primary');
			movieBtn.attr("id",imdbId);

			if(!imgLink) {
				movieBtn.text("Sorry No Image Found");
				movieBtn.css("color","red");
				console.log(movieBtn);
				console.log(imdbId);
			}

			$("#utellyResponse").append("<br>");
			$("#utellyResponse").append("<br>");
			$("#utellyResponse").append(movieBtn);
			$("#utellyResponse").append(posterCaption);
			}

			for(var j = 0; j < response.results[i].locations.length; j++) {
				var locationName = response.results[i].locations[j].display_name;
				var locationLink = response.results[i].locations[j].url;
				var link = $("<a>");
				link.attr("target", "_blank")
				link.attr("href",locationLink);
				link.text(locationName);
				
				$("#utellyResponse").append(link);
				$("#utellyResponse").append("<br>");
			}	
		}
		
		$(".btn-primary").on("click",function(){
			randomId = $(this).attr("id");
			myFunction(randomId);
		});


	});
};

function myFunction(movieId){
$(divTrailer).remove();
$(divMovieInfo).remove();


var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://movies-tvshows-data-imdb.p.rapidapi.com/?imdb=" + movieId + "&type=get-movie-details",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com",
		"x-rapidapi-key": "1fb5bf74ddmsh5f6ba0a2a786e4bp19be3ejsn84732bde066a"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
	var youtubeTrailerKey = response.youtube_trailer_key;
	
	if(!response.title) {
		console.log("false");

		var tvId = movieId;
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": "https://movies-tvshows-data-imdb.p.rapidapi.com/?imdb=" + tvId + "&type=get-show-details",
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "movies-tvshows-data-imdb.p.rapidapi.com",
				"x-rapidapi-key": "1fb5bf74ddmsh5f6ba0a2a786e4bp19be3ejsn84732bde066a"
			}
		}
	
		
		$.ajax(settings).done(function (response) {
			
			if(!response.title){
				// alert("No Movie Info Found");
				divMovieInfo = $("<div>");
				var movieInfoHeading = $("<h2>No Movie/Show Info Found</h2>");
				divMovieInfo.append(movieInfoHeading);
				selectBody.append(divMovieInfo);
			}else {
				console.log(response)
				var movieRated = response.rated;
				var movieDescription = response.description;
				var movieReleaseDate = response.release_date;
				var movieRunTime = response.runtime;
				var movieRating = response.imdb_rating;
				var movieGenre = response.genres.join(", ");
				var movieCreators = response.creators.join(", ");

				var movieActors = response.stars.join(", ");

				console.log(response);

			var youtubeTrailerKey = response.youtube_trailer_key;

			console.log(youtubeTrailerKey);
			
			var trailerVideo = $("<iframe>");
			var videoLink = $("<a>");
			divMovieInfo = $("<div>");
			divTrailer = $("<div>");
			divTrailer.attr("id","divTrailer");
			trailerVideo.attr("src","https://www.youtube.com/embed/" + youtubeTrailerKey);
			divTrailer.append(trailerVideo);
			divTrailer.append("<br>");
			if(youtubeTrailerKey == "") {
				videoLink = $("<p>Sorry no video found</p>");
			}
			else{
				videoLink.attr("href","https://www.youtube.com/watch?v="+youtubeTrailerKey);
				videoLink.text("Click to watch on youtube");
			}

			divTrailer.append(videoLink);
			selectBody.append(divTrailer);
			selectBody.append(divMovieInfo);


			var movieInfoHeading = $("<h2>Movie Info:</h2>");
			divMovieInfo.append(movieInfoHeading);


			divMovieInfo.append("Plot:<br>"+movieDescription);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Director(s):<br>" + movieCreators);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Actor(s)/Actress(es):<br>" + movieActors);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Rated:<br>"+movieRated);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Release Date:<br>" + movieReleaseDate);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("IMDB Rating:<br>" + movieRating +"/10");
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Genre:<br>" + movieGenre);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Runtime:<br>" + movieRunTime + " minutes");
			}
		});
	}

	else {
		var movieRated = response.rated;
		var movieDescription = response.description;
		var movieReleaseDate = response.release_date;
		var movieRunTime = response.runtime;
		var movieRating = response.imdb_rating;
		var movieGenre = response.genres.join(", ");
		var movieDirectors = response.directors.join(", ");
		var movieActors = response.stars.join(", ");



		var youtubeTrailerKey = response.youtube_trailer_key;


			var trailerVideo = $("<iframe>");
			var videoLink = $("<a>");
			divMovieInfo = $("<div>");
			divTrailer = $("<div>");
			divTrailer.attr("id","divTrailer");
			trailerVideo.attr("src","https://www.youtube.com/embed/" + youtubeTrailerKey);
			divTrailer.append(trailerVideo);

			divTrailer.append("<br>");
			
			if(youtubeTrailerKey == "") {
				videoLink = $("<p>Sorry no video found</p>");
				videoLink.addClass("vLink");
			}
			else{
				videoLink.attr("href","https://www.youtube.com/watch?v="+youtubeTrailerKey);
				videoLink.text("Click to watch on youtube");
			}

			divTrailer.append(videoLink);


			selectBody.append(divTrailer);
			selectBody.append(divMovieInfo);


			var movieInfoHeading = $("<h2>Movie Info:</h2>");
			divMovieInfo.append(movieInfoHeading);


			divMovieInfo.append("Plot:<br>"+movieDescription);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Director(s):<br>" + movieDirectors);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Actor(s)/Actress(es):<br>" + movieActors);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Rated:<br>"+movieRated);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Release Date:<br>" + movieReleaseDate);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("IMDB Rating:<br>" + movieRating+"/10");
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Genre:<br>" + movieGenre);
			divMovieInfo.append("<br>");
			divMovieInfo.append("<br>");

			divMovieInfo.append("Runtime:<br>" + movieRunTime + " minutes");
	}

});

}
