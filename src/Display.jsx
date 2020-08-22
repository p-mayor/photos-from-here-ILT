import React from 'react'

class Display extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            photos: [],
            currentNumber: 0,
            lat: -8.340539,
            lon: 115.091949
        }
    }

    componentDidMount() {
        let onSuccess = (location) => {
            console.log(location.coords)
            this.setState({
                lat: location.coords.latitude,
                lon: location.coords.longitude
            })
            this.getPictures()
        }
        let onFail = (err) => {
            console.log(err.message)
            this.getPictures()
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onFail)

    }

    getPictures() {
        let URL = `https://shrouded-mountain-15003.herokuapp.com/https://flickr.com/services/rest/?api_key=d354ec6250a62eb1abebd8a6501e836c&format=json&nojsoncallback=1&method=flickr.photos.search&safe_search=1&per_page=5&lat=${this.state.lat}&lon=${this.state.lon}&text=cat&text=dog`

        fetch(URL).then((response) => {
            return response.json()
        }).then((photoResponseObject) => {
            this.setState({ photos: photoResponseObject.photos.photo })
        }).catch((err) => {
            console.log(err)
        })

    }

    constructImageURL(photoObj) {
        return "https://farm" + photoObj.farm +
            ".staticflickr.com/" + photoObj.server +
            "/" + photoObj.id + "_" + photoObj.secret + ".jpg";
    }

    clickHandler = () => {
        this.setState((prevState, props) => {
            if (prevState.currentNumber === prevState.photos.length - 1) {
                return { currentNumber: 0 }
            } else {
                return { currentNumber: prevState.currentNumber + 1 }
            }
        })
    }

    render() {
        let element = ""
        let photosExist = this.state.photos.length > 0

        if (photosExist) {
            let currentPhotoObj = this.state.photos[this.state.currentNumber]
            let photoURL = this.constructImageURL(currentPhotoObj)
            element = (
                <div>
                    <img src={photoURL} alt="from flickr" />
                    <br />
                    {currentPhotoObj.title}
                    <br/>
                    {this.state.photos.map((photoObj, i)=>{
                        return <img src={this.constructImageURL(photoObj)} key={i} alt={photoObj.title}/>
                    })}
                </div>
            )
        }

        return (
            <div className="Display">
                <button onClick={this.clickHandler}>Next photo</button>
                <br />
                {element}
            </div>
        )
    }
}

export default Display;