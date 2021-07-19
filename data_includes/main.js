// ========================================================
// === IBEX exp. Chao Sun, last update: 03.02.21 (CS) ===
// ========================================================
// Prerequired commands
PennController.ResetPrefix(null);  // setting prefix to zero
PennController.DebugOff()

// source: https://www.pcibex.net/forums/topic/adding-break-trials/
/*function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.shift());
                for (let j = 0; j < sep.length && main.length>0; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }*/
//
//
//
//
//Sequence("counter", "hello", "consent", "demographics", "explain", "prac", "start", sepWithN( "break" , randomize("trial") , 22 ) , "send" , "final" );
Sequence("counter", "start", randomize("trial") , "send" , "final" );
SetCounter("counter", "inc", 1);
//
//
//
// =========== The Experiment ================
// I. A PennController Sequence to organize the order of Presentation
//PennController.Sequence("hello", sepWithN( "break" , randomize("trial") , 1 ) , "send" , "final" )
// "hello",  "preloadTrial","consent", "demographics", "explain",
//
//
//
//
// II. The Controller(s)

//1. Information
    PennController("information"
        ,

        newHtml("infor", "info_sheet.html")
            .center()
            .print()
            .log()
        ,

        getHtml("infor")
        ,

        newButton("continue")
            .center()
            .print()
            .wait()
        ,

    .setOption("countsForProgressBar", false) // this section will not be counted in the progress bar
    .setOption("hideProgressBar", true) // progress bar hidden during this controller.
    .noHeader()
    ;
//
//
// 2. Consent
    PennController("consent"
        ,

        newHtml("consent", "consent.html")
            .center()
            .print()
            .log()
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,
        newButton("agree", "I consent (continue)")
//            .log()
//            .print("center at 50%", "middle at 75%" )
//            .wait()
     ,
       newButton("disagree", "I do NOT consent (leave)")
//            .print("center at 50%", "middle at 25%" )
//            .wait()
        ,
       newCanvas("form", 600, 200)
            .settings.center()
            .settings.add(   50, 100, getButton("disagree") )
            .settings.add(   400, 100, getButton("agree") )
            .print()
        ,
        newSelector()

            .settings.add( getButton("agree") , getButton("disagree") )
            .settings.log()
            .wait()
            .test.selected( getButton("disagree"))
            .success( newText("Please close this tab to exit the experiment.")
                        .center()
                        .print()
                        .wait())

    )
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    .noHeader()
    ;
//
// 3. Welcomming Participant and asking for ID
PennController("hello"
        ,

        // Create HTML element from Form uploaded to "chunk_includes" section
        newHtml("hi", "hello.html")
            .center()
            .print()
            .log()
        ,

        // get HTML element, which includes printing it
        getHtml("hi")
        ,

        // collect participant ID using a 'text input field'
        newTextInput("ID")
            .center()
            .length(24)
            .before(newText("<p>Please enter your ProlificID here:  <\p>"))
            .log()
            .print()
        ,

        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,
        // new Button, will wait until the regex in "getTextInput("ID").test.text(regex)" matches the Input from TextInput "ID" - for now, a 24 long string of "word characters" is necessary
        newButton("continue")
            .center()
            .print()
            .wait(
                getTextInput("ID").test.text(/\w{1}/)
                    .failure(
                        newText("Please enter your Prolific ID!")
                            .color("red")
                            .print()
                            )
            )
            .remove()
        ,

        // declare Input from ID a global variable
        newVar("ID") //
            .global()
            .set(getTextInput("ID"))
    )
    .log( "ID" , getVar("ID")) // ensuring to collect ID
    .setOption("countsForProgressBar", false) // this section will not be counted in the progress bar
    .setOption("hideProgressBar", true) // progress bar hidden during this controller.
    .noHeader()
    ;
//
//
//
// 4. Collecting demographic data

    PennController("demographics"
        ,
        newHtml("demographics", "demographics.html")
            .center()
            .print()
            .log()
        ,
        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,
        newButton("continue", "continue")
            .center()
            .print()
            .wait(
                getHtml("demographics").test.complete()
                    .failure( getHtml("demographics").warn() )
                )
    )
    .log("ID", getVar("ID"))  // ensuring to collect ID
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true)
    .noHeader()
    ;
//
//
// 5. Procedure explained
    PennController("explain"
        ,

        newHtml("howto", "howto.html")
            .center()
            .print()
            .log()
        ,

        getHtml("howto")
        ,

        // cheap formating with white space text element, adding two empty lines
        newText("doublebreak", "<br><br>")
            .print()
        ,

        newButton("start0", "Got it!")
            .log()
            .center()
            .print()
            .wait()
    )

    .log("ID", getVar("ID"))  // ensuring to collect ID
    .setOption("countsForProgressBar", false)
    .setOption("hideProgressBar", true);
//
//6. Training - None
    PennController("training1"
    ,

    newImage("N", "https://uclpsych.eu.qualtrics.com/ControlPanel/Graphic.php?IM=IM_1FwOXfkwVNlEtTg")
    ,

    newText("none", "Here's a girl that has baked cupbakes but has not decorated them.")
    ,

    newButton("start1", "Got it! Show me more!")
    ,

    newCanvas("girl1", 600, 200)
         .settings.center()
         .settings.add(   100, 0, getImage("N") )
         .settings.add(   0, 100, getText("none") )
         .settings.add( 0, 200, getButton("start2") )
         .print()
     ,

     newSelector()
         .settings.add( getButton("start1")  )
         .settings.log()
         .wait()

)
// Training - Some
    PennController("training2"
    ,

    newImage("S", "https://uclpsych.eu.qualtrics.com/ControlPanel/Graphic.php?IM=IM_0oLxV6vNTsHER4a")
    ,

    newText("some", "Here's a girl that has baked cupbakes but has not finished decorating them.")
    ,

    newButton("start2", "Got it! Show me more!")
    ,

    newCanvas("girl2", 600, 200)
         .settings.center()
         .settings.add(   100, 0, getImage("S") )
         .settings.add(   0, 100, getText("some") )
         .settings.add( 0, 200, getButton("start2") )
         .print()
     ,

     newSelector()
         .settings.add( getButton("start2")  )
         .settings.log()
         .wait()

)
//Training - ALL
  PennController("training3"
  ,

  newImage("A", "https://uclpsych.eu.qualtrics.com/ControlPanel/Graphic.php?IM=IM_3CVKsHmo2uTy7QO")
  ,

  newText("all", "Here's a girl that has baked cupbakes and has finished decorating them.")
  ,

  newButton("start3", "I'm ready. Let's get to work.")
  ,

  newCanvas("girl3", 600, 200)
       .settings.center()
       .settings.add(   100, 0, getImage("A") )
       .settings.add(   0, 100, getText("all") )
       .settings.add( 0, 200, getButton("start3") )
       .print()
   ,

   newSelector()
       .settings.add( getButton("start3")  )
       .settings.log()
       .wait()

  )
//
//
// 7. Trial events
    PennController.Template( PennController.GetTable("item.csv"),   // creates a template to be used for multiple trials; will use .csv in chunk_includes
        variable =>
        PennController("trial"
            ,
            newTimer("wait1", 250)
                .start()
                .wait()
            ,

            newImage("one", variable.Link)
                .settings.size(560, 280)
            ,

            newText("scenario", "Here's a group of girls after their craft class.")
            ,

            newText("instruction", "Please describe the situation for the parents as best as you can.")
            ,

            newDropDown("O", "...")
                .settings.add("All","Some", "None")
                .settings.log()
            ,

            newDropDown("I", "...")
                .settings.add("all","some", "none")
                .settings.log()
            ,

            newText("sentence", variable.Sentence1)
                .settings.before( getDropDown("O") )
                .settings.after( getDropDown("I") )
                .after( newText("sentence2", variable.Sentence2) )
                .settings.css("font-size", "xxem")
            ,

            newButton("next", "Next")
            ,

            newCanvas("task", 400, 400)
                .settings.center()
                .settings.add( 0, 0, getText("scenario"))
                .settings.add( 0, 50, getImage("one") )
                .settings.add( 0, 300, getText("instruction") )
                .settings.add( 100, 350, getText("sentence"))
                .settings.add( 400, 400, getButton("next"))
                .print()
            ,

            newSelector()
                .settings.add(getButton("next"))
                .wait()

    )

    .log("Item", variable.Item)
    .log("List", variable.List)
    .log("Condition", variable.Condition)
    .log( "ID" , getVar("ID")) // ensures that for each trial, logging value of ID in variable ID; this should be OUTSIDE of PennController()
    );
//
//
// 8. Send results
    PennController.SendResults( "send" ); // important!!! Sends all results to the server
//
//
//
//
// 9. Thank you screen
PennController( "final" ,
                newText("<p>Thank you for your participation!</p>")
                .print()
                ,
                newText("<p><a href='https://app.prolific.co/submissions/complete?cc=658AB7CA'>Please click this link to confirm your participation</a></p>") // confirmation link (e.g., for payment)
                .print()
                ,
                newButton("void") // this creates a 'void' button that must be clicked to continue. This is because we don't want them to be able to continue beyond this screen
                .wait() // so basically this is the end and there's no way to go any further
               );
