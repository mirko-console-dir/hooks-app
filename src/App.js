import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const photosUrl = "https://jsonplaceholder.typicode.com/photos";
  const albumsUrl = "https://jsonplaceholder.typicode.com/albums";
  const usersUrl = "https://jsonplaceholder.typicode.com/users";

  /* abbiamo bisogno di gestire lo stato per mantenere le foto nello stato */
  /* passaimo alla funzione la variabile , array, oggetti o ciò che vogliamo gestire lo stato, ritorna 2 valori  varibile per far riferimento e una funz per modificarlo, destrutturiamo e prendiamo cosa ci serve*/
  /* gli hook vanno usati nella funzione principale, react si basa sull'ordine degli useState che vengono chiamati */
  /* GESTIRE STATO DEL COMPONENTE CON useState */
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  /* mettiamo a gestire nello stato due nuovi valori... */
  /* le chiamate verranno fatte solo quando viene selezionata la ricerca passando le variabili in use Effect input */
  /* se impostiamo 0 di defaul la pag non renderizza nulla con 1 renderizza i dati del 1 album */
  const [userSelected, setSelectedUser] = useState(1);
  const [albumSelected, setSelectedAlbum] = useState(1);

  /* creiamo una funzione che ci permette di eseguire una funzione che passiamo ogni volta che il componente viene montato e update,
  il return che verrà eseguito sarà componentWillUnmount
  gli input sono i parametri che osserva useEffect per azionarsi, senza essi viene chiamato entrambe le volte mount e update*/
  /* CON useEffect LO USIAMO PER OGNI CHIAMATA  */
  useEffect(() => {
    /* async per poter mettere await per aspettare che si risolvi la promise ma in una funz di useEffect   */
    const getPhotos = async () => {
      const url = userSelected
        ? photosUrl + "?albumId=" + albumSelected
        : photosUrl;
      /* chiamata fetch per le foto, primo then torna una promise,  con il seconto .then avremo le photos aggiornate con setphotos ,
      le photos rappresentano il nostro stato*/
      /* con la prima chiamata viene modificato lo stato e viene rirenderizzato, scatta ancora mount viene fatta la chiamata e setphoto rifa lo stato e riscatta update in loop per fermare il loop passiamo un array vuoto, se mettiamo valori */
      const photos = await fetch(url).then((res) => res.json());
      /*  .then((photos) => { */
      setPhotos(photos);
      /* }); */
    };

    if (userSelected || albumSelected) {
      getPhotos();
    }

    return () => {};
  }, [userSelected, albumSelected]);

  useEffect(() => {
    const getAlbums = async () => {
      const url = userSelected
        ? albumsUrl + "?userId=" + userSelected
        : albumsUrl;
      const albums = await fetch(url).then((res) => res.json());
      setAlbums(albums.slice(0, 20));
    };
    getAlbums();
  }, [userSelected]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await fetch(usersUrl).then((res) => res.json());
      setUsers(users.slice(0, 20));
    };
    getUsers();
  }, [userSelected]);

  /* Funzione riceve l'evento, con la destrutturazione ci prendiamo target , andare nel plugin di react su chrome e possiamo vedere gli hooks, METTIAMO IL + PER TRASFORMARE LA STRINGA IN NUMERO*/

  /* FUNZIONI HELPER PER METODO onChange i metodi ritornati da useState e come parametri gli utenti selezionati e album selezionati*/
  const manageChangeUser = ({ target }) => {
    setSelectedUser(+target.value);
  };
  const manageChangeAlbum = ({ target }) => {
    setSelectedAlbum(+target.value);
  };

  /* come fare logica di selected, con variabile selectedOpt con valore ternario utilizzando UserId */
  /* COMPONENTE INLINE */
  const Opt = ({ id, title, name, userId }) => {
    const selectedOpt =
      id === (userId ? albumSelected : userSelected) ? "selected" : null;
    const optName = userId ? title : name;
    return (
      <option selected={selectedOpt} value={id} key={id}>
        {optName}
      </option>
    );
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1>Albums</h1>
          {/* form per filtrare */}
          <form className="gallery">
            <div>
              <div className="form-group">
                <label htmlFor="users">
                  {" "}
                  Author
                  <select name="users" id="users" onChange={manageChangeUser}>
                    <option value="">Select User</option>
                    {/* mostrare album e utente selezionato, se condide con id mettiamo prorpietà selected con un piccolo componente Opt sopra */}
                    {users.map((u) => (
                      <Opt {...u} />
                    ))}
                  </select>
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="albums">
                  {" "}
                  Albums
                  <select
                    name="albums"
                    id="albums"
                    onChange={manageChangeAlbum}
                  >
                    <option value="">Select Album</option>
                    {albums.map((a) => (
                      <Opt {...a} />
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </form>
          {/* mostrare elenco photo */}
          <ul class="photos">
            {photos.map((photo) => (
              <li key={photo.id}>
                <img
                  src={photo.thumbnailUrl}
                  title={photo.title}
                  alt={photo.title}
                />
              </li>
            ))}
          </ul>
        </header>
      </div>
    </>
  );
}

export default App;
