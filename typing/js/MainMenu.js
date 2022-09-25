class MainMenu extends React.Component {
    constructor(props) {
        //Needed to instantiate a react component
        super(props);
        //Variable declartions

        //State members declarations to update the render.
        this.state = {
            accuracyCheck: false,
            dropdownchoice: 0
            //There is nothing because we incorporate Redux features in our React Component. Woo-hoo
        }

        this.onAccCheckChanged = this.onAccCheckChanged.bind(this);

    }
    componentDidMount() {
        //This will re-render the render() twice. One from begining and another from this.
        if (localStorage.getItem("accuracyMode") != null) {

            this.setState({ accuracyCheck: (localStorage.getItem("accuracyMode") === "true") });
            this.props.store.setAccuracyMode(localStorage.getItem("accuracyMode") === "true");
        }
        if (localStorage.getItem("desired_time") != null) {
            $("#slider-timer").val(localStorage.getItem("desired_time"));
        }
        //We need to declare a new variable featuring this as jquery this refers to the current element (this) not the react (this).
        var that = this;
        //Choices
        $('#choices a').on('click', function () {
            that.setState({ dropdownchoice: $(this).index() });
        });
        $('.cb-history').on('click', function () {
            that.forceUpdate();
        });
    }
    componentWillUnmount() {

    }
    onAccCheckChanged(event) {
        this.props.store.setAccuracyMode(event.target.checked);
        this.setState({ accuracyCheck: event.target.checked });
        localStorage.setItem("accuracyMode", event.target.checked);
    }

    getHistoryScore() {
        function getMatchingWord(list, list2, get_index) {

            let render = (<div></div>);
            let isCorrect = (index, index2) => {
                if (list2[index][index2] != list[index][index2]) {
                    return { color: "red", backgroundColor: "white" };
                } else {
                    return { color: "green", backgroundColor: "white" };
                }
            };
            //Render our current text. Green means correct, red is wrong.
            if (list.length > 0) {
                render = (
                    <div>
                        {
                            ($("#cb-" + get_index).prop('checked') == false ?
                                list.map((chars, index) => {
                                    return <div key={"Useless" + index} >{chars.split("").map((get_index, index2) => {
                                        return <span key={"Uselesses" + index2} style={isCorrect(index, index2)}>{get_index}</span>
                                    })}<br></br></div>

                                }) : list2.map((chars, index) => {
                                    return <div key={"Useless" + index} >{chars.split("").map((get_index, index2) => {
                                        return <span key={"Uselesses" + index2} style={isCorrect(index, index2)}>{get_index}</span>
                                    })}<br></br></div>

                                }))
                        }
                        <label>
                            <input id={"cb-" + get_index} className="cb-history" type="checkbox"></input>
                            <span className="font-Kavivanar fontSize-16px">Show your input</span>
                        </label>
                    </div>
                );
            }
            return render;
        }
        //Render our high scores
        if (localStorage.getItem("highscore") != null) {
            let data = null;

            if (this.state.dropdownchoice === 0) {
                data = JSON.parse(localStorage.getItem("highscore")).recent.map((c, index) => {
                    return (
                        <div id="highscore-margin" key={"list" + index}>

                            <details >
                                <summary>
                                    <div>
                                        {
                                            c.mode == "Story" ?
                                                <li style={{ width: "25%", display: "inline", overflow: "scroll" }} className="list-group-item">{c.mode + " - WPM: " + c.wpm + " Accuracy: " + c.accuracy + "% True WPM: " + Math.round(c.wpm * c.accuracy/100.0)  + " Time taken " + c.time + " Finished time: " + c.finished}</li>
                                                : <li style={{ width: "25%", display: "inline", overflow: "scroll" }} className="list-group-item">{c.mode + " " + c.startTime + " minutes" + "- WPM: " + c.wpm + " Accuracy: " + c.accuracy + "% True WPM: " + Math.round(c.wpm * c.accuracy/100.0)  +  " Characters Typed: " + c.characters + " Finished time: " + c.finished}</li>
                                        }
                                    </div>
                                </summary>
                                {
                                    getMatchingWord(c.answer, c.submission, index)
                                }
                            </details>
                        </div>)
                })
            } else if (this.state.dropdownchoice === 1) {
                data = JSON.parse(localStorage.getItem("highscore")).play.map((c, index) => {
                    return (
                        <div id="highscore-margin" key={"list" + index}>

                            <details>
                                <summary>
                                    <div >
                                        <li style={{ width: "25%", display: "inline", overflow: "scroll" }} className="list-group-item">{"Story " + c.topic + " | WPM: " + c.wpm + " Accuracy: " + c.accuracy + "% True WPM: " + Math.round(c.wpm * c.accuracy/100.0)  + " Finished time: " + c.finished}</li>
                                    </div>
                                </summary>
                                {
                                    getMatchingWord(c.answer, c.submission, index)
                                }
                            </details>
                        </div>)
                })
            } else if (this.state.dropdownchoice === 2) {
                data = JSON.parse(localStorage.getItem("highscore")).timed.map((c, index) => {
                    return (
                        <div id="highscore-margin" key={"list" + index}>
                            <details>
                                <summary>
                                    <div>
                                        <li style={{ width: "25%", display: "inline", overflow: "scroll" }} className="list-group-item">{"Timer " + c.startTime + " minutes" + "- WPM: " + c.wpm + " Accuracy: " + c.accuracy + " True WPM: " + Math.round(c.wpm * c.accuracy/100.0) + "% True WPM: " + Math.round(c.wpm * c.accuracy/100.0)+ " Characters Typed: " + c.characters + " Finished time: " + c.finished}</li>
                                    </div>
                                </summary>
                                {
                                    getMatchingWord(c.answer, c.submission, index)
                                }
                            </details>
                        </div>)
                })
            } else if (this.state.dropdownchoice === 3) {
                data = JSON.parse(localStorage.getItem("highscore"))['best-play'].map((c, index) => {
                    return (
                        <div id="highscore-margin" key={"list" + index}>
                            <details>
                                <summary>
                                    <div>
                                        <li style={{ width: "25%", display: "inline", overflow: "scroll" }} className="list-group-item">{"Story " + c.topic + " | WPM: " + c.wpm + " Accuracy: " + c.accuracy + "% True WPM: " + Math.round(c.wpm * c.accuracy/100.0) + " Finished time: " + c.finished}</li>
                                    </div>
                                </summary>
                                {
                                    getMatchingWord(c.answer, c.submission, index)
                                }
                            </details>
                        </div>)
                })
            } else if (this.state.dropdownchoice === 4) {
                data = JSON.parse(localStorage.getItem("highscore"))['best-timed'].map((c, index) => {
                    return (
                        <div id="highscore-margin" key={"list" + index}>
                            <details>
                                <summary>
                                    <div>
                                        <li style={{ width: "25%", display: "inline", overflow: "scroll" }} className="list-group-item">{"Timer " + c.startTime + " minutes" + "- WPM: " + c.wpm + " Accuracy: " + c.accuracy + "% True WPM: " + Math.round(c.wpm * c.accuracy/100.0) + " Characters Typed: " + c.characters + " Finished time: " + c.finished}</li>
                                    </div>
                                </summary>
                                {
                                    getMatchingWord(c.answer, c.submission, index)
                                }
                            </details>
                        </div>)
                })
            }
            return (
                <ul className="list-group">
                    {data}
                </ul>)
        } else {
            return (
                <ul className="list-group">

                </ul>)
        }

    }
  
    render() {
        let that = this;
        function drawTypeModes() {
            let arr = [];
            for (let i = 0; i < MAX_STORIES; i++) {
                arr.push(i);
            }
      
            return arr.map((elements, index) => {
                return (<div id={"button-" + (index + 2)} className="menu btn newLine" onClick={() => { that.props.playGame(index + 1) }}>
                    {"Typing #"+(index + 1)}
                </div>);
            });
        }
        let typed_options = drawTypeModes();
        return (
            //Draw our text of display
            <div className="configureInput">

                <h1 className="center-text font-Mochiy-Pop-P-One fontSize-64px">Typing Game</h1>
                <div className="font-Tourney fontSize-36px">Want to just type now? Simply click either to get started!</div>
                <div id="button-1" className="menu btn newLine" onClick={() => { this.props.playGame(Math.floor(Math.random() * MAX_STORIES) + 1) }}>
                    Topic
                </div>
                <div id="button-2" className="menu btn newLine" onClick={() => {
                    this.props.playTimed($("#slider-timer").val());
                }}>
                    Timed
                </div>

                <input className="font-Kavivanar fontSize-24px" id="slider-timer" type="number" min="0" max="10" defaultValue="1" />
                <span className="font-Kavivanar fontSize-24px">Minutes</span>
                <div className="font-Tourney fontSize-36px">or select what topic to type to get started!</div>
                <div id="button-1" className="menu btn newLine" onClick={() => { this.props.playGame(0) }}>
                    Intro
                </div>
                {typed_options}

                <br></br>
                <label>
                    <input type="checkbox" id="checkbox-acc" checked={this.state.accuracyCheck} onChange={this.onAccCheckChanged}></input>
                    <span className="font-Kavivanar fontSize-24px">Enable Accuracy</span>
                </label>

                <div id="howToPlay">
                    <h2 className="font-Condiment fontSize-36px font-bold">How to play?</h2>
                    <div className="font-Kavivanar fontSize-24px">1&#41; The objective of typing is to type all of the text EXACTLY as what it says on the screen.</div>
                    <div className="font-Kavivanar fontSize-24px">2&#41; All words and sentences MUST have proper capitalization and punctuation.</div>
                    <div className="font-Kavivanar fontSize-24px">3&#41; Characters colored green means that it is typed correctly, red means that it is typed incorrectly.</div>
                    <div className="font-Kavivanar fontSize-24px">4&#41; Press Enter or Space to be able to go to the next line (only if everything in the current line is correct)</div>
                    <div className="font-Kavivanar fontSize-24px">5&#41; Timer starts once the first character is typed.</div>
                    <div className="font-Kavivanar fontSize-24px">6&#41; When you are done typing, it will display your Words Per Minute (WPM) and Accuracy (in %).</div>
                    <div className="font-Kavivanar fontSize-24px">7&#41; The Enable Accuracy will incorporate accuracy into the results. It also allows to be able to go to next line even there are mistakes. This does impact your results.</div>
                    <div className="font-Kavivanar fontSize-24px">8&#41; Right Clicking, Copying, Pasting, Cutting, as well as dragging text are disabled.</div>
                </div>
                {/*Coming Soon */}
                <div id="howToPlay">
                    <div className="font-Kavivanar fontSize-24px">Typing History (Coming Soon!)</div>
                    <div className="btn-group dropup">
                        <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="sr-only">Choose history</span>
                        </button>
                        <div id="choices" className="dropdown-menu">
                            <a className="dropdown-item">Recent</a>
                            <a className="dropdown-item">Topic</a>
                            <a className="dropdown-item">Timed</a>
                            <a className="dropdown-item">Topic - Best</a>
                            <a className="dropdown-item">Timed - Best</a>
                        </div>
                    </div>

                    {this.getHistoryScore()}

                </div>
            </div>
        )
    }
}