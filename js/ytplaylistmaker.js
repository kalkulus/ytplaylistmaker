// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#newPlaylist button#create').prop('disabled', false);
    getUserPlaylists();
}

// Search for a specified string and add song to playlist
function searchAndAddSong(query, s, playlistId) {
  if (query == undefined){
    var query = $('#query').val();
  }
  if (s == undefined) {
    s = 1;
  }

  setTimeout(function(){
    var request = gapi.client.youtube.search.list({
      q: query,
      part: 'snippet',
      maxResults: 20
    });

    request.execute(function(response) {    
      // var str = JSON.stringify(response.result);
      // $('#search-container').html('<pre>' + str + '</pre>');

      var itemsList = '';
      var items = response.result.items;
      if (items.length > 0){
    //    console.log('Found: '+items[0].snippet.title);
    //    addToPlaylist(items[0].id.videoId, playlistId);        
    	var minDistance = levenshteinenator(query, items[0].snippet.title);
        var closestIndex = (items[0].id.videoId != undefined)? 0 : -1;
	for(var i=1; i < items.length; i++){
          var distance = levenshteinenator(query, items[i].snippet.title);
          if (distance < minDistance && items[i].id.videoId != undefined){
            minDistance = distance;
            closestIndex = i;
            }
        }
	if (closestIndex >= 0){
        	console.log('Found: '+items[closestIndex].snippet.title);
	        console.log('Found ID: '+items[closestIndex].id.videoId);
	       	addToPlaylist(items[closestIndex].id.videoId, playlistId);
	}
      }      
    });
  }, s*1000);
}

// Add a video to a playlist. The "startPos" and "endPos" values let you
// start and stop the video at specific times when the video is played as
// part of the playlist. However, these values are not set in this example.
function addToPlaylist(videoId, playlistId, startPos, endPos) {
  var details = {
    videoId: videoId,
    kind: 'youtube#video'
  }
  if (startPos != undefined) {
    details['startAt'] = startPos;
  }
  if (endPos != undefined) {
    details['endAt'] = endPos;
  }
  var request = gapi.client.youtube.playlistItems.insert({
    part: 'snippet',
    resource: {
      snippet: {
        playlistId: playlistId,
        resourceId: details
      }
    }
  });
setTimeout(function(){
  request.execute(function(response) {        
    console.log("Added: "+response.result.snippet.title);
    console.log("URL: http://youtube.com/watch/?v="+response.result.snippet.resourceId.videoId);
    $('#log').append("Added: <a href='http://youtube.com/watch/?v=" + response.result.snippet.resourceId.videoId + "' target='<_blank></_blank>'>" + response.result.snippet.title + "</a><br />");
  });
}, Math.floor((Math.random() * 1000) + 1)); 
}

function getUserPlaylists(){
  var request = gapi.client.youtube.playlists.list({
    part: 'snippet',
    mine: true,
    maxResults: 50
  });
  request.execute(function(response) {      
      $('#playlists select').empty();
      $('#playlists select').append('<option value="">-- Select a playlist --</option>');
      for(var i = 0; i < response.result.items.length; i++){
        var playlist = response.result.items[i];
        $('#playlists select').append('<option value="'+playlist.id+'">'+playlist.snippet.title+'</option>');
      }
  });
}

// Create a private playlist.
function createPlaylist(playlistName) {
  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status',
    resource: {
      snippet: {
        title: playlistName,
        description: ''
      },
      status: {
        privacyStatus: 'private'
      }
    }
  });
  request.execute(function(response) {
    var result = response.result;
    if (result) {
      playlistId = result.id;
      $('#newPlaylistId').val(playlistId);
      $('#newPlaylistName').val(result.snippet.title);
      // $('#playlist-title').html(result.snippet.title);
      // $('#playlist-description').html(result.snippet.description);

      $('#newPlaylist #form').hide();
      $('#createNewPlaylist').show();
      $('#newPlaylist .status').html('Playlist <a href="http://www.youtube.com/playlist?list=' + playlistId +'" target="_blank">'+ playlistName + '</a> created :)');

    } else {
      $('#newPlaylist .status').html('Could not create playlist');
    }
  });
}

function getSelectedPlaylist(){
    var playlist = {};
    if ($('#playlists select').is(':visible')){
        playlist.id = $('#playlists select').val();
        playlist.name = $('#playlists select option:selected').text();
    } else if ($('#newPlaylistId').val() != '') {
        playlist.id = $('#newPlaylistId').val();
        playlist.name = $('#newPlaylistName').val();
    }

    return playlist;
}
