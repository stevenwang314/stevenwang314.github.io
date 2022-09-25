const MODE_MENU = "MODE_MENU";
const MODE_PLAY = "MODE_PLAY";
const MODE_TIMED = "MODE_TIMED";

class MainApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentMode: MODE_MENU,
        }
        this.playGame = this.playGame.bind(this);
        this.playTimed = this.playTimed.bind(this);
        this.goToMenu = this.goToMenu.bind(this);
    }
    makeSelection(index) {
        switch (index) {
            case 0:
                this.props.setWordsToType(story_intro.split("\n"), "Introduction to Typing");
                break;
            case 1:
                this.props.setWordsToType(article_computer.split("\n"), "Computers");
                break;
            case 2:
                this.props.setWordsToType(article_usb.split("\n"), "Usb");
                break;
            case 3:
                this.props.setWordsToType(article_cellPhones.split("\n"), "Cell Phones");
                break;
            case 4:
                this.props.setWordsToType(article_qwerty.split("\n"), "History of QWERTY");
                break;
            case 5:
                this.props.setWordsToType(article_solarSystem.split("\n"), "Solar System");
                break;
            case 6:
                this.props.setWordsToType(article_sounds.split("\n"), "Sound");
                break;
            case 7:
                this.props.setWordsToType(article_marianaTrench.split("\n"), "Mariana Trench");
                break;
            case 8:
                this.props.setWordsToType(article_movie.split("\n"), "Benefits of Movies");
                break;
            case 9:
                this.props.setWordsToType(article_climate.split("\n"), "Climate and Garden");
                break;
            case 10:
                this.props.setWordsToType(article_plants.split("\n"), "Plant Growth");
                break;
            case 11:
                this.props.setWordsToType(article_earthquake.split("\n"), "Earthquake Scenario");
                break;
            case 12:
                this.props.setWordsToType(article_mountEverest.split("\n"), "Mount Everest");
                break;
            case 13:
                this.props.setWordsToType(article_graphicsCard.split("\n"), "Graphics Card");
                break;
            case 14:
                this.props.setWordsToType(article_blueScreenOfDeath.split("\n"), "Blue screen of death (BSOD)");
                break;
            case 15:
                this.props.setWordsToType(article_bios.split("\n"), "Basic Input/Output System (BIOS)");
                break;
            case 16:
                this.props.setWordsToType(article_computerCables.split("\n"), "Computer Cables");
                break;
            case 17:
                this.props.setWordsToType(article_precipitation.split("\n"), "Precipitation");
                break;
            case 18:
                this.props.setWordsToType(article_solarEnergy.split("\n"), "Solar Energy");
                break;
            case 19:
                this.props.setWordsToType(article_vitaminC.split("\n"), "Vitamin C");
                break;
            case 20:
                this.props.setWordsToType(article_resume1.split("\n"), "Writing a Resume - Part 1");
                break;
            case 21:
                this.props.setWordsToType(article_resume2.split("\n"), "Writing a Resume - Part 2");
                break;
            default:
                this.props.setWordsToType(["This is a test typing","Simply a 2 line typing test for testing purposes"], "-");
                break;
        }
    }
    playTimed(time) {
        localStorage.setItem("desired_time", Math.min(10, Math.max(0, time)));
        this.setState({
            currentMode: MODE_TIMED,
            getTimer: Math.min(10, Math.max(0, time))
        });
    }
    playGame(index) {
        this.setState({
            currentMode: MODE_PLAY,
        });
        this.makeSelection(index);
    }
    goToMenu() {
        this.setState({
            currentMode: MODE_MENU,
        })
    }
    render() {
        return (
            //Draw our text of display
            <div>
                {this.state.currentMode == MODE_MENU ? <MainMenu store={this.props} playTimed={this.playTimed} playGame={this.playGame} /> : <GameMode store={this.props} currentMode={this.state} returnToMenu={this.goToMenu} />}
            </div>
        )
    }
}