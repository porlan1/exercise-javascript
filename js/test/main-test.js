//testing object constructors
QUnit.test('object constructors', function(assert){
  assert.expect(8);
  var sw = new StarWars();
  assert.ok(sw instanceof StarWars);
  var m = new Movie({characters: ['a', 'b']});
  assert.ok(m instanceof Movie);
  assert.strictEqual(m.characters.length, 2);
  assert.deepEqual(m.mData, {characters: ['a', 'b']});
  var c = new Character({starships: ['a', 'b', 'c']});
  assert.ok(c instanceof Character);
  assert.strictEqual(c.starShips.length, 3);
  assert.deepEqual(c.cData, {starships: ['a', 'b', 'c']});
  var ss = new StarShip({});
  assert.ok(ss instanceof StarShip)
});

//testing asynchronous data methods
QUnit.test('object methods', function(assert){
  assert.expect(19);
  var m, sw;
  var dones1, dones2;
  var p1, p2, p3, div, sw;
  var c = new Character({
  "name": "Luke Skywalker",
  "height": "1.72 m",
  "mass": "77 Kg",
  "hair_color": "Blond",
  "skin_color": "Caucasian",
  "eye_color": "Blue",
  "birth_year": "19 BBY",
  "gender": "Male",
  "homeworld": "http://swapi.co/api/planets/1/",
  "films": [
      "http://swapi.co/api/films/1/",
      "http://swapi.co/api/films/2/",
      "http://swapi.co/api/films/3/"
  ],
  "species": [
      "http://swapi.co/api/species/1/"
  ],
  "vehicles": [
      "http://swapi.co/api/vehicles/14/",
      "http://swapi.co/api/vehicles/30/"
  ],
  "starships": [
      "http://swapi.co/api/starships/12/",
      "http://swapi.co/api/starships/22/"
  ],
  "created": "2014-12-09T13:50:51.644000Z",
  "edited": "2014-12-10T13:52:43.172000Z",
  "url": "http://swapi.co/api/people/1/"});

  p1 = c.getVehicleData();
  dones1 = new Array(p1.length);
  for (let i = 0; i < p1.length; i++) {
    dones1[i] = assert.async();
    p1[i].then(function(){
      assert.ok(true);
      dones1[i]();
      }, function(){
        assert.ok(false);
        dones1[i]();
    });
  }
  m = new Movie({
"characters": [
"http://swapi.co/api/people/1/",
"http://swapi.co/api/people/2/",
"http://swapi.co/api/people/3/",
"http://swapi.co/api/people/4/",
"http://swapi.co/api/people/5/",
"http://swapi.co/api/people/10/",
"http://swapi.co/api/people/13/",
"http://swapi.co/api/people/14/",
"http://swapi.co/api/people/18/",
"http://swapi.co/api/people/20/",
"http://swapi.co/api/people/21/",
"http://swapi.co/api/people/22/",
"http://swapi.co/api/people/23/",
"http://swapi.co/api/people/24/",
"http://swapi.co/api/people/25/",
"http://swapi.co/api/people/26/"
]});
  p2 = m.getCharacterData();
  dones2 = new Array(p2.length);
  for (let i = 0; i < p2.length; i++) {
    dones2[i] = assert.async();
    p2[i].then(function(){
      assert.ok(true);
      dones2[i]();
      }, function(){
        assert.ok(false);
        dones2[i]();
    });
  }
  

  div = $('<div></div>');
  div.addClass('dropdown-menu');
  $('#qunit-fixture').append(div);
  sw = new StarWars();
  p3 = sw.getMovieData();
  dones3 = assert.async();
  p3.then(function(){
      assert.ok(true);
      dones3();
      }, function(){
        assert.ok(false);
        dones3();
    });
});

//tests for the display:

QUnit.test('display', function(assert){
  assert.expect(3);
  //render movie dropdown
  var sw = new StarWars(), div = $('<div></div>');
  var table = $('<table></table>'), tbody = $('<tbody></tbody>');
  sw.movies = [new Movie({title: 'a', characters: 'a'})];
  sw.movies[0].characters = [new Character({name: 'a', starships: 'a'})];
  sw.movies[0].characters[0].starShips = [new StarShip({name: 'a'})];
  div.addClass('dropdown-menu');
  $('#qunit-fixture').append(div);
  $('#qunit-fixture').append(table);
  table.append(tbody);
  sw.renderMovieDropDown();
  assert.strictEqual($('.movieList').length, 1);
  //test table display
  sw.selectedMovie = 0;
  sw.reRenderTable();
  assert.strictEqual($('#qunit-fixture').find('td').length, 2);
  assert.strictEqual($('#qunit-fixture').find('td').html(),
    "<a><span class=\"glyphicon glyphicon-remove\"></span></a><span>a</span>");

});

//tests for user actions
QUnit.test('user actions', function(assert){
  assert.expect(3);
  var sw = new StarWars(), div = $('<div></div>');
  var table = $('<table></table>'), tbody = $('<tbody></tbody>');
  sw.movies = [new Movie({title: 'a', characters: 'a'})];
  sw.movies[0].characters = [new Character({name: 'a', starships: 'a'})];
  sw.movies[0].characters[0].starShips = [new StarShip({name: 'a'})];
  $('#qunit-fixture').append(div);
  div.addClass('dropdown-menu');
  sw.renderMovieDropDown();
  //simulate click on dropdown
  $('#qunit-fixture').append(table);
  table.append(tbody);
  $('#m_0').trigger('click');
  assert.strictEqual(sw.selectedMovie, 0);
  assert.strictEqual($('#qunit-fixture').find('tr').length, sw.movies[0].characters.length);
  //simulate mouse click of table element
  $('tbody').find('tr').find('td').find('a').trigger('click');
  assert.strictEqual($('#qunit-fixture').find('tr').length, 0);
}); 