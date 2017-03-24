function StarWars(){
  this.selectedMovie = undefined;
  this.movies;
  this.tableTimer = undefined;
  this.getMovieData = function(){
    var that = this;
    //ajax call fills in movie Data
    //maps movie data into an array of movie objects
    //once this is done, each movie then getsCharData
    return Promise.resolve($.ajax({url:'http://swapi.co/api/films/',
            dataType: 'json',
            success: function(data){
              that.movies = new Array(data.results.length);
              data.results.forEach(function(d, i){
                that.movies[i] = new Movie(d);
                that.movies[i].getCharacterData();
            })
              that.renderMovieDropDown();
            }}));
  }

  this.selectMovie = function(index){
    if (this.selectedMovie !== index){
      this.selectedMovie = index;
      this.reRenderTable();
    }
  }

  this.renderMovieDropDown = function(){
    //sort the movies by release date
    var i, j, li, a, id, that = this;
    var div, currentDiv;
    this.movies.sort(function(a, b){
      return new Date(a.mData.release_date) > new Date(b.mData.release_date);
    });
    for (i = 0; i < this.movies.length; i++) {
      li = $('<li></li>');
      a = $('<a></a>');
      li.append(a);
      a.addClass('movieList');
      a.text(this.movies[i].mData.title);
      id = 'm_' + i;
      a.attr('id', id);
      a.on('click', function(e){
      	//selects a movie, and fills in the table
        var sIndex = parseInt(e.target.id.split('_')[1]);
        var elList;
        if (that.selectedMovie !== sIndex) {
          that.selectedMovie = sIndex;
          elList = [].slice.call(document.getElementsByClassName('movieList'),0);
          elList.forEach(function(d){
          	d.style['background-color']='rgba(0,0,0,0)'});
          e.target.style['background-color'] = 'rgba(255,255,255,0.8)';
          that.reRenderTable();
        }
      });
      a.on('mouseenter mouseleave', function(e){
      	if (e.type === 'mouseenter') {
      		e.target.style['background-color'] = 'rgba(255,255,255,0.8)';
      	} else {
      		if (parseInt(e.target.id.split('_')[1]) !== sw.selectedMovie) {
      			e.target.style['background-color'] = 'rgba(0,0,0,0)';
      		}
      	}
      });
      $('.dropdown-menu').append(li);
    }
  }

  this.reRenderTable = function(){
    var tbody = $('tbody'), that = this, text;
    var td1, td2, sm = this.movies[this.selectedMovie];
    var a, span1, span2;
    //wrapping in a try block, as error means the table is
    //not fully loaded yet
    try {
      tbody.empty();
      for (let i = 0; i < sm.characters.length; i++) {
        let tr = $('<tr></tr>');
        td1 = $('<td></td>');
        td2 = $('<td></td>');
        a = $('<a></a>');
        a.on('click', function(){
          //remove from character data;
          sm.characters.splice(i, 1);
          that.reRenderTable();
        });
        span1 = $('<span></span>');
        span1.addClass('glyphicon glyphicon-remove');
        a.append(span1);
        span2 = $('<span></span>');
        span2.text(sm.characters[i].cData.name);
        td1.append(a);
        td1.append(span2);
        text = '';
        for (var j = 0; j < sm.characters[i].starShips.length; j++) {
          text += sm.characters[i].starShips[j].sData.name;
          if (j !== sm.characters[i].starShips.length - 1){
            text += ', ';
          }
        }
        td2.text(text);
        tr.append(td1);
        tr.append(td2);
        tbody.append(tr);
        window.clearInterval(that.tableInterval);
        that.tableInterval = undefined;
        $('.loadAnimation').css('visibility', 'hidden');
        $('.movieLabel').text(sm.mData.title);
        $('.movieLabel').css('visibility', 'visible');
      }
    } catch (e) {
      if (that.tableInterval === undefined) {
        that.tableInterval = window.setInterval(function(){that.reRenderTable();}, 100);
        $('.loadAnimation').css('visibility', 'visible');
        $('.movieLabel').css('visibility', 'hidden');
      }
    }
  }
}

function Movie(mData){
  this.mData = mData;
  this.characters = new Array(this.mData.characters.length);
  
  this.getCharacterData = function() {
    var that = this;
    var promises = new Array(this.mData.characters.length);
    for (let i = 0; i < this.mData.characters.length; i++) {
      //ajax call assigning the data to each character
      //using promises for async testing
      promises[i] = Promise.resolve($.ajax({url: that.mData.characters[i],
              dataType: 'json',
              success: function(data){
                that.characters[i] = new Character(data);
                that.characters[i].getVehicleData();
              }
            }));
    }
    return promises;
  }
}

function Character(cData){
  this.cData = cData;
  this.starShips = new Array(this.cData.starships.length);
  this.getVehicleData = function() {
    var that = this;
    var promises = new Array(this.cData.starships.length);
    for (let i = 0; i < this.cData.starships.length; i++) {
      //ajax call assigning the data to each starship
      //using promises for async testing
      promises[i] = Promise.resolve($.ajax({url: that.cData.starships[i],
              dataType: 'json',
              success: function(data){
                that.starShips[i] = new StarShip(data);
              }
            }));
    }
    return promises;
  }
}

function StarShip(sData){
  this.sData = sData;
}