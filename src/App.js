import "bootstrap/dist/css/bootstrap.min.css"
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap"
import { useState, useEffect } from "react"

const CLIENT_ID = "b656a3e7c63b49f9a2f115ab6dabd336"
const CLIENT_SECRET = "45de3bd111a443cd8c93203a87b0b410"
function App() {
  const [searchInput, setSearchInput] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    }

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((response) => response.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((error) => console.log(error))
  }, [])

  async function search() {
    if (searchInput === "") return
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id
      })

    var albums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => setAlbums(data.items))
  }

  return (
    <div className="App">
      <Container>
        <InputGroup className="nb-3" size="lg">
          <FormControl
            placeholder="Wyszukaj aryste"
            type="input"
            onKeyPress={(event) => {
              if (event.key == "Enter") {
                search()
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>Szukaj</Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.length > 0 ? (
            albums.map((album, index) => (
              <Card key={index}>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div></div>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default App
