const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;
let Container = connect(mapStateToProps,mapDispatchToProps)(MainApp);


const MAX_STORIES = 21;

const stories = [article_cellPhones,article_climate,article_computer,article_marianaTrench,article_movie,article_plants,article_qwerty,
  article_solarSystem,article_sounds,article_usb, article_earthquake, article_mountEverest, article_graphicsCard, article_blueScreenOfDeath, 
  article_bios,article_computerCables,article_precipitation,article_solarEnergy, article_vitaminC, article_resume1, article_resume2] ;
//Format Time to HH:MM:SS
const formatTime = (time) => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);

    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + ":" + sec;
}
//Wrapper to wrap around TextGui react component
class AppWrapper extends React.Component {
    render() {
      return (
        //Use redux to get the store and send that to TextGui as props variables.
        <Provider store={store}>
          <Container/>
        </Provider>
      );
    }
  };
//Render that instead.
ReactDOM.render(<AppWrapper/>, document.getElementById("text-components"));