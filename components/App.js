var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'QjCHVafUjUCxAUcPfOtYfmk8wON715RL';


App = React.createClass({

    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },
/*Algorytm postępowania dla poniższej metody jest następujący:

    1.pobierz na wejściu wpisywany tekst,
    2.zasygnalizuj, że zaczął się proces ładowania,
    3.Rozpocznij pobieranie gifa,
    4.Na zakończenie pobierania:
     -przestań sygnalizować ładowanie,
     -ustaw nowego gifa z wyniku pobierania,
     -ustaw nowy stan dla wyszukiwanego tekstu
*/
    handleSearch: function(searchingText) {  // 1.
        this.setState({
          loading: true  // 2.
        });
        this.getGif(searchingText, function(gif) {  // 3.
          this.setState({  // 4
            loading: false,  // a
            gif: gif,  // b
            searchingText: searchingText  // c
          });
        }.bind(this));
    },
    /*
1.Na wejście metody getGif przyjmujemy dwa parametry: wpisywany tekst (searchingText) i funkcję, która ma się wykonać po pobraniu gifa (callback)
2.Konstruujemy adres URL dla API Giphy (pełną dokumentację znajdziesz pod tym adresem)
3.Wywołujemy całą sekwencję tworzenia zapytania XHR do serwera i wysyłamy je.
4.W obiekcie odpowiedzi mamy obiekt z danymi. W tym miejscu rozpakowujemy je sobie do zmiennej data, aby nie pisać za każdym razem response.data.
5.Układamy obiekt gif na podstawie tego co otrzymaliśmy z serwera
6.Przekazujemy obiekt do funkcji callback, którą przekazaliśmy jako drugi parametr metody getGif.  
*/
    getGif: function(searchingText, callback) {  // 1.
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2.
        var xhr = new XMLHttpRequest();  // 3.
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
               var data = JSON.parse(xhr.responseText).data; // 4.
                var gif = {  // 5.
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
               callback(gif);  // 6.
            }
        };
        xhr.send();
    },
//promise
    getGif: function(searchingText, callback){
        return new Promise(
            function(resolve){
                const url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText; 
                const xhr = new XMLHttpRequest();
                    xhr.onload = function() {
                    if (xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText).data;
                        let gif = {  
                        url: data.fixed_width_downsampled_url,
                        sourceUrl: data.url
                    };
                    resolve(gif);
                    }
                }
            })
        xhr.open('GET', url);
        xhr.send();
    },



    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
            <div style={styles}>
                <h1>Wyszukiwarka GIFow!</h1>
                <p>Znajdź gifa na <a href='http://giphy.com'>giphy</a>. Naciskaj enter, aby pobrać kolejne gify.</p>
                <Search onSearch={this.handleSearch} />

                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});