class SpotifyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            playListData: {
                "href": "https://api.spotify.com/v1/users/steve420-/playlists?offset=0&limit=50",
                "items": []
                  
            }
        };
        this.getUserProfile = this.getUserProfile.bind(this);
        this.extractProfileData = this.extractProfileData.bind(this);
    }

    render() {
        let getProfile = (<div></div>);
        let drawAnalyzeList = (<div></div>);
        let categories = (<div></div>);
        if (this.state.user.hasOwnProperty("id")) {
            getProfile = (<div><p className="general-font-big"><a className="no-show-link" href={this.state.user.external_urls.spotify}>{"User: " + this.state.user.display_name}</a></p>
            <span className="general-font">{"Followers: " + this.state.user.followers.total}</span>
            <span className="general-font space-left">{"ID: " + this.state.user.id}</span> </div>);
        }
        if (this.state.playListData.hasOwnProperty("items")) {
            drawAnalyzeList =
            <tbody>
                {
                    //Note that for onClick events that have parameters , we must write it in () => function(p1)
                    this.state.playListData.items.map((c, index) =>
                        <tr key={"track" + index}>
                            <th key={"name" + c} scope="row"><a key={c.external_urls.spotify} className={"no-show-link text-primary search-song-name"} target="_blank" href={c.external_urls.spotify}>{c.name}</a></th>
                            <td>{c.description}</td>
                            <td><img src={c.images[0].url} width="200" height="200" alt="playlist image"></img></td>
                            <td>{c.id}</td>
                            <td>{c.owner.display_name}</td>
                            <td>{c.public === true ? "Public" : "Private"}</td>
                            <td>{c.tracks.total}</td>
                            <td><button onClick={()=>this.props.loadPlaylist(this.state.playListData.items[index])}>Load to Playlist</button></td>
                        </tr>
                    )}
            </tbody>
        categories = ["Playlist Name", "Playlist Description", "Images", "Id", "Owner", "Public", "Track Count","Options"].map(c => <th key={c} scope="col">{c}</th>);
        }
        return (
            <div id="profile-bg">

                <h1 className="general-font no-lineBreak">Profile Information</h1>
                <button onClick={this.getUserProfile} className="general-btn-text" id="button-get-profile">Get User Profile</button>
                {getProfile}
                <table id="search-table" className="table">
                    <thead>
                        <tr key="searchTable">{categories}</tr>

                    </thead>
                    {drawAnalyzeList}
                </table>
            </div>
        );
    }

    getUserProfile() {
        //Get the user profile.
        let getData = fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: {
                "Authorization": localStorage.getItem("spotify_token_type") + " " + localStorage.getItem("spotify_access_token"),
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                response.json().then(
                    (json) => {
                        if (json.hasOwnProperty("error") === false) {
                            this.extractUserData(json);
                        } else {
                            processError(json.error);
                        }
                    }
                );


            });

        //Get a list of playlist.
        let limit = 50;
        getData = fetch("https://api.spotify.com/v1/me/playlists?limit=" + limit, {
            method: 'GET',
            headers: {
                "Authorization": localStorage.getItem("spotify_token_type") + " " + localStorage.getItem("spotify_access_token"),
                "Content-Type": "application/json"
            },
        })
            .then((response) => {
                response.json().then(
                    (json) => {
                        if (json.hasOwnProperty("error") === false) {
                            this.extractProfileData(json);
                        } else {
                            processError(json.error);
                        }

                    }
                );


            });
    }
    extractUserData(json) {
        this.setState({
            user: json
        }, ()=> {
            document.getElementById("userID").value = json.id;
            localStorage.setItem("userID",  json.id);
        });
    }
    extractProfileData(json) {
        this.setState({
            playListData: json

        });
    }
}