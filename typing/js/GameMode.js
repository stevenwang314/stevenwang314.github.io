class GameMode extends React.Component {
    constructor(props) {


        //Needed to instantiate a react component
        super(props);
        //Variable declartions

        //State members declarations to update the render.
        this.state = {
            value: ""
            //There is nothing because we incorporate Redux features in our React Component. Woo-hoo
        }

        //Function declarations
        this.textChanged = this.textChanged.bind(this);
        this.reset = this.reset.bind(this);
        this.disableCopyCutPaste = this.disableCopyCutPaste.bind(this);
        this.contextMenu = this.contextMenu.bind(this);

        this.second_timer = null;
        this.old = 0;
        this.newLine = false;
        this.oldLine = false;
        this.yourWords = [{ words: "", acc: 0, char: 0 }];
        this.total_acc = 0;
        this.total_char = 0;
        this.start = new Date().getTime();
        //a timer (measured in seconds) - In TIMED mode.
        this.startTime = 0;
        this.reset();
   
    }

    getMatchingWord(get_index) {

        let render = (<div></div>);
        let isCorrect = (char, index) => {
            if (index > this.props.store.input.length - 1) {
                return { color: "black", };
            }
            if (char != this.props.store.input[index]) {
                return { color: "red", backgroundColor: "rgba(255,0,0,0.5)" };
            } else {
                return { color: "green", backgroundColor: "rgba(0,255,0,0.5)" };
            }
        };
        let isCorrect2 = (char, index) => {
            if (get_index < this.yourWords.length) {

                if (char != this.yourWords[get_index].words[index]) {
                    return { color: "red", backgroundColor: "rgba(255,0,0,0.5)" };
                } else {
                    return { color: "green", backgroundColor: "rgba(0,255,0,0.5)" };
                }
            }
        };

        //Render our current text. Green means correct, red is wrong.
        if (this.props.store.data.length > 0 && get_index >= 0 && get_index < this.props.store.data.length) {

            render = (
                <div>
                    {
                        this.props.store.data[get_index].split("").map((c, index) => {
                            return <span className={index == this.props.store.char_index ? "highlighted" : "3"} key={"Useless" + index} style={this.props.store.row == get_index ? isCorrect(c, index) : isCorrect2(c, index)}>{c}</span>
                        })
                    }
                </div>
            );
        }
        return render;
    }
    //Activates when text from our input box has changed.
    //This is solved by not using OnSelect in input event.
    textChanged(e) {

        //Start time when text is first changed.
        if (this.second_timer === null && this.props.store.hasWon === false) {
            this.start = new Date().getTime();
            this.second_timer = setInterval(() => {
                //Measure current time. Note that when user switches browser, timer freezes. We used starting time and current time to measure elapsed time.
                this.props.store.incrementTime(Math.floor((new Date().getTime() / 1000 - this.start / 1000)));
                if (this.props.currentMode.currentMode === MODE_TIMED) {
                    if (this.startTime - this.props.store.time <= 0) {
                        this.evaluation();
                        this.props.store.setFinished();
                    }
                }
            }, 50);
        }
        //Get the text length difference between now and previous. This allows us to add to letter count.
        if (this.newLine === false && this.oldLine === false) {
           
            this.yourWords[this.props.store.row].words = $("#typeInput").val();
            this.props.store.modifyLetterCount($("#typeInput").val().length - this.old);
            this.old = $("#typeInput").val().length;
            this.props.store.setInputText($("#typeInput").val());

        }
        else if (this.newLine === true) {
            $("#typeInput").val("");
            
            this.newLine = false;
        } else if (this.oldLine === true) {

            $("#typeInput").val(this.yourWords[this.props.store.row].words);
            this.props.store.setInputText(this.yourWords[this.props.store.row].words);
            this.oldLine = false;
        }
    }
    contextMenu = (event) => {
        event.preventDefault()
        return false;
    }
    evaluation = () => {
        //Evaluation of accuracy and characters typed.
        let item = this.props.store.data[this.props.store.row].split("");
        let filter = this.props.store.input.split("").filter((c, index) => {
            return item[index] == c;
        });
        //Measure accuracy of the current length of the word
        this.yourWords[this.props.store.row].acc = filter.length;
        this.yourWords[this.props.store.row].char =  this.yourWords[this.props.store.row].words.length;
    }
    //Acivated when key is down.
    keyDown = (event) => {
        const goNext = () => {
            console.log(this.yourWords);
            this.evaluation();
            //Go to the next line.
            this.props.store.nextRowIndex();

            if (this.props.currentMode.currentMode === MODE_TIMED) {

                if (this.props.store.row + 3 >= this.props.store.data.length) {

                    this.props.store.addWordsToType(stories[Math.floor(Math.random() * MAX_STORIES)].split("\n"));
                }
            }

            if (this.props.store.row + 1 < this.props.store.data.length) {
                this.yourWords.push({});
            }
            //Clear text input
            $("#typeInput").val("");
            this.old = 0;
            //This flag is used to prevent text changes when the text goes into next line.
            if (event.key == ' ') {
                this.newLine = true;
            }


        }
        const goPrev = () => {
            console.log(this.yourWords);
            if (this.oldLine === false && this.props.store.row > 0) {
                this.props.store.prevRowIndex();

                this.old = this.yourWords[this.props.store.row - 1].words.length;
                $("#typeInput").val(this.yourWords[this.props.store.row - 1].words);
                this.yourWords.pop();
                this.oldLine = true;
            }
        }
        if (this.props.store.accuracyMode === false) {

            if (event.key == 'Enter' || event.key == ' ') {
                if (this.props.store.data[this.props.store.row] === this.props.store.input) {
                    goNext();
                }
            }
        } else if (this.props.store.accuracyMode === true) {

            if (this.props.store.data[this.props.store.row].length === this.props.store.input.length) {
                if (event.key != 'Backspace')
                    goNext();

            }
            if (this.props.store.input.length == 0) {
                if (event.key == 'Backspace') {
                    goPrev();
                }
            }
        }
    }
    //Resets the typing session setting everything back to default.
    reset() {
        this.props.store.resetRowIndex();
        this.old = 0;
        clearInterval(this.second_timer);
        this.second_timer = null;
        $("#typeInput").val("");
        $("#typeInput").prop("disabled", false);
        this.yourWords = [{ words: "", acc: 0, char: 0 }];
        this.total_acc = 0;
        this.total_char = 0;
        this.newLine = false;
        this.oldLine = false;
        this.start = new Date().getTime();
        if (this.props.currentMode.currentMode == MODE_TIMED) {
            this.startTime = this.props.currentMode.getTimer * 60;
            let choice = Math.floor(Math.random() * (MAX_STORIES-1));
            //Add a random article to timed typing. If it chooses a resume, than include both resumes at the same time.
            if (choice != 19) {
                this.props.store.setWordsToType(stories[choice].split("\n"), "");
            } else {
                this.props.store.setWordsToType(article_resume1.concat(article_resume2).split("\n"), "");
            }
        }
    }
    disableCopyCutPaste(e) {
        e.preventDefault()
        return false;
    }
    //Record results once typing is finished.
    recordResults() {
        let scores = (localStorage.getItem("highscore") != null ? JSON.parse(localStorage.getItem("highscore")) : {"play":[],"timed":[], "recent":[],"best-play":[],"best-timed":[]});
        //Only keep the recent 100 elements.
       
        if (scores["recent"].length > 100) {
            scores["recent"].shift();
        }
        if (this.props.currentMode.currentMode == MODE_PLAY) {
            let data = {
                wpm:  Math.round((this.props.store.letters / 5) / (this.props.store.time / 60.0)),
                accuracy: Math.round(this.total_acc / this.total_char * 100.0),
                topic: this.props.store.textId,
                time: this.props.store.time,
                submission: this.yourWords.map(c=> c.words),
                answer: this.props.store.data,
                finished: new Date().toLocaleString('en-US')
            };
             //Only keep the recent 100 elements.
            if (scores["play"].length > 100) {
                scores["play"].shift();
            }
            scores["play"].push(data);
       

            scores["recent"].push(Object.assign({},data,{mode:"Story"}));
 

            //Attempt to add it onto the high scores. Only keep the 10 best scores.
            scores["best-play"].push(data);
            scores["best-play"].sort((a,b) => {
                return a.accuracy * a.wpm - b.accuracy * b.wpm;
            })
            scores["best-play"] = scores["best-play"].slice(0,10);
            localStorage.setItem("highscore",JSON.stringify(scores));
        } 
        else if (this.props.currentMode.currentMode == MODE_TIMED) {
         
            let data = {
                wpm:  Math.round((this.props.store.letters / 5) / (this.props.store.time / 60.0)),
                accuracy: Math.round(this.total_acc / this.total_char * 100.0),
                characters: this.total_char,
                startTime: this.startTime/60,
                submission: this.yourWords.map(c=> c.words),
                answer: this.props.store.data.slice(0, this.yourWords.length),
                finished: new Date().toLocaleString('en-US')
            }
            //For the current line, only get the characters that the user typed. Any untyped are ignored.
            data.answer[data.submission.length-1] = data.answer[data.submission.length-1].slice(0,data.submission[data.submission.length-1].length);
            if (scores["timed"].length > 100) {
                scores["timed"].shift();
            }
            scores["timed"].push(data);
            scores["recent"].push(Object.assign({},data,{mode:"Timer"}));     
   
            
            //Attempt to add it onto the high scores. Only keep the 10 best scores.
            scores["best-timed"].push(data);
            scores["best-timed"].sort((a,b) => {
                return  b.accuracy * b.wpm - a.accuracy * a.wpm;
            })
            scores["best-timed"] = scores["best-timed"].slice(0,10);

            localStorage.setItem("highscore",JSON.stringify(scores));
        } 
        
    }
    render() {
        if (this.props.store.hasWon === true) {

            if (this.second_timer != null) {
                //Stop the timer
                clearInterval(this.second_timer);
                this.second_timer = null;
                //Disable input
                $("#typeInput").prop("disabled", true);
                //Get total accuracy and characters typed from each line
                this.total_acc = this.yourWords.reduce((prev, start) => {
                    return start.acc + prev
                }, 0);
                this.total_char = this.yourWords.reduce((prev, start) => {
                    return start.char + prev
                }, 0);
                //Record results onto our scores
                this.recordResults();
            }
        }

        return (
            //Draw our text of display
            <div id="words_to_display">
                {this.props.currentMode.currentMode == MODE_PLAY ?
                    <div className="center-text font-Mochiy-Pop-P-One fontSize-42px">{"Current Topic: " + this.props.store.textId}</div> :
                    <div className="center-text font-Mochiy-Pop-P-One fontSize-64px">{this.startTime / 60 + " minute timed mode"}</div>
                }

                {this.props.currentMode.currentMode === MODE_PLAY && <div id="typeProgress">
                    <div className="font-Kavivanar fontSize-24px">{"Current Progress: " + Math.floor(this.props.store.row / this.props.store.data.length * 100) + "%"}</div>
                    <div className="progress" style={{ width: "50%" }}>
                        <div className="progress-bar bg-success" role="progressbar" style={{ width: (this.props.store.row / this.props.store.data.length * 100) + "%" }}></div>

                    </div>
                </div>}

                {/*By default <div> elements are block elements. To disable new line we must change it to either inline or inline-block*/}
                {this.props.currentMode.currentMode == MODE_PLAY ?
                    <div id="border-elapsed" className="newLine">
                        <span className="font">{"Elapsed Time: " + formatTime(Math.floor(this.props.store.time))}</span>
                    </div> :
                    <div id="border-elapsed" className="newLine">
                        <span className="font">{"Time left: " + formatTime(Math.ceil(this.startTime - this.props.store.time))}</span>
                    </div>
                }
                {this.props.store.hasWon === true && <div id="border-wpm" className="newLine">
                    <span className="font">{"Base WPM: " + Math.round((this.props.store.letters / 5) / (this.props.store.time / 60.0))}</span>
                </div>}
                {this.props.store.hasWon === true && <div id="border-acc" className="newLine">
                    <span className="font">{"Accuracy: " + Math.round(this.total_acc / this.total_char * 100.0) + "%"}</span>
                </div>}
                {this.props.store.hasWon === true && <div id="border-owpm" className="newLine">
                    <span className="font">{"True WPM: " + Math.round(this.total_acc / this.total_char *Math.round((this.props.store.letters / 5) / (this.props.store.time / 60.0))) }</span>
                </div>}
                <div className="font-Kavivanar fontSize-36px">Type everything you see EXACTLY on the green screen.</div>

                {/* This is our text-to-display */}
                <div id="background-typing">
                    {/*Previous second Line*/}

                    {this.props.store.row - 2 >= 0 ? <span className="text-type" style={{ opacity: 0.2 }} > {this.getMatchingWord(this.props.store.row - 2)}</span> : <div className="text-type" style={{ opacity: "0" }}>Text</div>}
                    {/*Previous Line*/}
                    {this.props.store.row - 1 >= 0 ? <span className="text-type" style={{ opacity: 0.4 }} > {this.getMatchingWord(this.props.store.row - 1)}</span> : <div className="text-type" style={{ opacity: "0" }}>Text</div>}
                    {/*Current Line*/}
                    {this.props.store.row < this.props.store.data.length ? <span className="text-type">{this.getMatchingWord(this.props.store.row)}</span> : <div><span className="text-type"></span><br /></div>}
                    {/*Next Line*/}
                    {this.props.store.row + 1 < this.props.store.data.length ? <span className="text-type" style={{ opacity: 0.4 }}> {this.getMatchingWord(this.props.store.row + 1)}</span> : <span className="text-type" style={{ opacity: "0" }}></span>}
                    {/*Next Line*/}
                    {this.props.store.row + 2 < this.props.store.data.length ? <span className="text-type" style={{ opacity: 0.2 }}> {this.getMatchingWord(this.props.store.row + 2)}</span> : <span className="text-type" style={{ opacity: "0" }}></span>}

                </div>
                {/*Our important input. There is an issue where characters that are typed too quickly does not activate onInput - needs fixing*/}
                <div className="configureInput text-type">
                    <input type="text"  id="typeInput" autoComplete="off" placeholder="click on this to begin typing!"
                    onPaste={this.disableCopyCutPaste} 
                    onCopy={this.disableCopyCutPaste} 
                    onCut={this.disableCopyCutPaste} 
                    onContextMenu={this.contextMenu} 
                    onKeyDown={this.keyDown} 
                    onInput={e => this.textChanged(e)} >
                    </input>
                </div>
                <br></br>
                {/*Reset typing session if messed up */}
                <button className="btn btn-secondary" onClick={this.reset}>Reset Session</button>
                {/*Go back to main menu */}
                <button className="btn btn-secondary" onClick={this.props.returnToMenu}>Back to menu</button><br></br>

                {/*Display finished typing session */}
                {this.props.store.hasWon === true &&
                    (this.props.currentMode.currentMode == MODE_PLAY ?
                        <div id="text-congratulations">Congratulations, you have finished typing everything!</div> :
                        <div id="text-congratulations">Times up!</div>
                    )}
            </div>
        )
    }

    componentDidMount() {
        $('#typeInput').bind('dragover', function (e) {
            e.preventDefault()
            return false;
        });

    }
    componentWillUnmount() {
        clearInterval(this.second_timer);
    }

}
// React-Redux:

//Convert state to properties for react.
const mapStateToProps = (state) => {
    return {
        data: state.words_to_type,
        input: state.current_input,
        row: state.current_row_index,
        hasWon: state.typingFinished,
        time: state.elapsedTime,
        letters: state.letters_typed,
        accuracyMode: state.accuracyMode,
        textId: state.current_typing_topic
    }
};

//Convert dispatch to properties for react.
const mapDispatchToProps = (dispatch) => {
    //By the way this returns an object, so you can have as many dispatches as you want.
    return {
        setWordsToType: (newMessage, items) => {
            dispatch(_setWordsToType(newMessage, items));
        },
        addWordsToType: (newMessage) => {
            dispatch(_addWordsToType(newMessage));
        },
        setInputText: (newMessage) => {
            dispatch(_setInputText(newMessage));
        },
        nextRowIndex: () => {
            dispatch(_nextRowIndex());
        },
        prevRowIndex: () => {
            dispatch(_prevRowIndex());
        },
        resetRowIndex: () => {
            dispatch(_resetRowIndex());
        },
        incrementTime: (time) => {
            dispatch(_incrementTime(time));
        },
        modifyLetterCount: (newMessage) => {
            dispatch(_modifyLetterCount(newMessage));
        },
        setAccuracyMode: (newMessage) => {
            dispatch(_setAccuracyMode(newMessage));
        },
        setFinished: () => {
            dispatch(_setFinished());
        }
    }
};
