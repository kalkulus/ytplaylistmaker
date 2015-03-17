$(function(){

	$('.hpnav-about, #close-about').click(function(e){
		e.preventDefault();
		
		$('#about').toggle();
		
	});	

	$('#about').hide();

	$('#newPlaylist button#create').click(function(){
		var playlistName = $('#newPlaylist #name').val();
		if (playlistName != '') {
			createPlaylist(playlistName);
			$('#newPlaylist .status').html('');
		} else {
			$('#newPlaylist .status').html('Please enter playlist name');
		}
	});

	$('#selectExistingPlaylist, #switchToNewPlaylist').click(function(e){
		e.preventDefault();
		$('#newPlaylist').toggle();
		$('#playlists').toggle();
	});

	$('#createNewPlaylist').click(function(e){
		e.preventDefault();
		$('#newPlaylist #form').show();
		$('#createNewPlaylist').hide();
      		$('#newPlaylist .status').html('');
	      	$('#newPlaylistId').val('');
      		$('#newPlaylistName').val('');
		$('#log').html('');
	
	});

	$('#refresh').click(function(e){
		e.preventDefault();
		getUserPlaylists();
	});

	$('#refresh').mouseover(function(event) {
		$('#refresh').tooltip('show');
	});
	$('#refresh').mouseout(function(event) {
		$('#refresh').tooltip('hide');
	});

	$('#songs textarea').keyup(function(){
		if ($('#songs textarea').val() != ''){
			$('#addSongs').prop('disabled', false);
		} else {
			$('#addSongs').prop('disabled', true);
		}
	});

	$('#addSongs').on('click', function(){		
		var selectedPlaylist = getSelectedPlaylist();
		if (selectedPlaylist.id === undefined){
			$('#songs .status').html('Please create new or select an existing playlist');
			return false;
		}
		$('#songs .status').html('');
		$('#log').html('');
		$('#log').append('<p>Addding songs to <a href="http://www.youtube.com/playlist?list=' + selectedPlaylist.id +'" target="_blank">' + selectedPlaylist.name + '</a> playlist </p>');

	  	var songs = $('#songs textarea').val().split("\n");
	  	for(var s = 0; s<songs.length; s++){
		    var song = songs[s].trim();
		    //song = song.replace(/[^\w\s]/gi, '');
		    song =song.replace(/[-'`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, ''); 
		    if (song != ''){
		    	searchAndAddSong(song, s, selectedPlaylist.id);
		    }
	  	}
	});

});
