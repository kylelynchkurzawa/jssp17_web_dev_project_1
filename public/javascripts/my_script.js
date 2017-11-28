console.log("JS loaded ok")

let keys_down_list = []
let key_down_drawings = []

let isRecording = false
let recording_start_time, recording_end_time
let recording_notes = []

let myAnalyserMap = new Map()

drawColour=(event_key)=>{
    //contain my piano key ids
    let pulse_container_ids = ["pc0", "pc1", "pc2", "pc3", "pc4", "pc5", "pc6"]
    //contain my audio ids
    let audio_elem_ids = ["q_key", "w_key", "e_key", "r_key", "i_key", "o_key", "p_key"]
    let audio
    console.log(`drawing for ${event_key} key`)
    switch(event_key){ 
        case("q"): 
            push_down_key_image("q")
            audio = new Audio(`audio/keys/g_sharp.wav`);//g_sharp
            audio.play();
            start_draw(50, 50)
            // start_advanced_animation(pulse_container_ids[0], 
            //                          audio_elem_ids[0])     
            break;
        case("w"):  
            push_down_key_image("w")    
            audio = new Audio(`audio/keys/a.wav`);//a
            audio.play();    
            start_draw(150, 50)
            // start_advanced_animation(pulse_container_ids[1], 
            //                          audio_elem_ids[1])   
            break;
        case("e"):  
            push_down_key_image("e")
            audio = new Audio(`audio/keys/b.wav`);//b
            audio.play();     
            start_draw(250, 50)   
            // start_advanced_animation(pulse_container_ids[2], 
            //                          audio_elem_ids[2]) 
            break;
        case("r"):
            push_down_key_image("r")
            // audio = new Audio(`scripts/keys/c.wav`);//c
            // audio.play();   
            // start_draw(350, 50)  
            start_advanced_animation(pulse_container_ids[3], audio_elem_ids[3]) 
            break;
        case("i"): 
            push_down_key_image("i")
            //audio = new Audio(`scripts/keys/d.wav`);
            audio = new Audio(`audio/keys/c.wav`);//d
            audio.play(); 
            start_draw(450, 50)   
            // start_advanced_animation(pulse_container_ids[4], 
            //                          audio_elem_ids[4])  
            break;
        case("o"):  
            push_down_key_image("o")
            //audio = new Audio(`scripts/keys/e.wav`);
            audio = new Audio(`audio/keys/d.wav`);//e
            audio.play();   
            start_draw(550, 50)  
            // start_advanced_animation(pulse_container_ids[5], 
            //                          audio_elem_ids[5]) 
            break;
        case("p"):  
            push_down_key_image("p")
            //audio = new Audio(`scripts/keys/f.wav`);
            audio = new Audio(`audio/keys/e.wav`);//f
            audio.play(); 
            start_draw(650, 50)
            // start_advanced_animation(pulse_container_ids[6], 
            //                         audio_elem_ids[6]) 
            break;
    default:
        break;
    }

}
stopColour=(event_key)=>{
    console.log(`stopping drawing for ${event_key} key`)
    let audio
    switch(event_key){
        case("q"):  
            audio = new Audio(`audio/keys/g_sharp.wav`);//g_sharp
            audio.pause();    
            stop_draw(50, 50)
            push_up_key_image("q")
            break;
        case("w"): 
            audio = new Audio(`audio/keys/a.wav`);//g_sharp
            audio.pause(); 
            stop_draw(150, 50)    
            push_up_key_image("w")   
            break;
        case("e"): 
            audio = new Audio(`audio/keys/b.wav`);//g_sharp
            audio.pause();  
            stop_draw(250, 50)  
            push_up_key_image("e")       
            break;
        case("r"):  
            stop_draw(350, 50)  
            push_up_key_image("r")       
            break;
        case("i"):  
            audio = new Audio(`audio/keys/c.wav`);//g_sharp
            audio.pause(); 
            stop_draw(450, 50) 
            push_up_key_image("i")        
            break;
        case("o"):  
            audio = new Audio(`audio/keys/d.wav`);//g_sharp
            audio.pause(); 
            stop_draw(550, 50) 
            push_up_key_image("o")        
            break;
        case("p"): 
            audio = new Audio(`audio/keys/e.wav`);//g_sharp
            audio.pause(); 
            stop_draw(650, 50)  
            push_up_key_image("p")       
            break;
        default:
            break;
    }
}

push_down_key_image=(event_key)=>{
    let pushed_key = document.getElementById(`${event_key}_image`)
    pushed_key.style.paddingTop = "4px"
}
push_up_key_image=(event_key)=>{
    let pushed_key = document.getElementById(`${event_key}_image`)
    pushed_key.style.paddingTop = "0px"
}

//need to make a bunch of circles in the div
//then change their size based on the audio being played
start_advanced_animation=(pulse_container_id, audio_ele_id)=>{
    let circle_elem_list, audio_analyser
    let audio_frequency_data = new Uint8Array()
    let audio_elem = document.getElementById(audio_ele_id)

    //if the init is false, never pressed the key before so need to do set up
    if(document.getElementById(pulse_container_id).getAttribute("init") == "false"){
        let audio_source
        
        //set up the audio analyser to get data from the sound
        audio_context = new AudioContext()
        audio_analyser = audio_context.createAnalyser()
        audio_source = audio_context.createMediaElementSource(audio_elem)
        audio_source.connect(audio_analyser)
        audio_analyser.connect(audio_context.destination)
        audio_analyser.fftSize = 64
        audio_frequency_data = new Uint8Array(audio_analyser.frequencyBinCount)

        //initilize the circle div's
        circle_init(pulse_container_id, audio_analyser.frequencyBinCount)

        //store the analyser for when the key is pressed again
        myAnalyserMap.set(pulse_container_id, audio_analyser)
        //get the analyzer from 'storage'
        audio_analyser = myAnalyserMap.get(pulse_container_id)
    }
    else{
        //get the analyzer from 'storage'
        audio_analyser = myAnalyserMap.get(pulse_container_id)
        audio_frequency_data = new Uint8Array(audio_analyser.frequencyBinCount)
        circle_reinit(pulse_container_id)
    }

    

    //get the analyzer from 'storage'
    audio_analyser = myAnalyserMap.get(pulse_container_id)

    //get all the circles first that are children of the container
    circle_elem_list = document.getElementById(pulse_container_id).getElementsByClassName("circle")

    let render_pulse_function = function(){
        audio_analyser.getByteFrequencyData(audio_frequency_data);
        
        //call the current renderer's function to render the next frame, passing in the frequency data
        change_circle_css(audio_frequency_data, circle_elem_list);

        //check to see if the audio has finished playing or has been paused
        if(( audio_elem.duration > 0 ) && (!audio_elem.paused)){
            //call the in browser function to update the animation frame with the passed in function
            requestAnimationFrame(render_pulse_function);
        }
        else{
            //need to clean up animation

            audio_analyser.getByteFrequencyData(audio_frequency_data);

            //call the current renderer's function to render the next frame, passing in the frequency data
            change_circle_css(audio_frequency_data, circle_elem_list);

            cleanup_circle_css(circle_elem_list)
        }
    }
    
    //play the audio and perform the animation
    audio_elem.play()
    //call the animation function
    render_pulse_function(/*audio_analyser, audio_frequency_data, circle_elem_list, audio_elem*/)
}

circle_init=(container_id, circle_num_max)=>{
    
        let container = document.getElementById(container_id)
        let width = 210
        let height = 210
        let circle_max_diameter=(width)
        let max_num_of_circles = circle_num_max || 50 //should be an ambiguous number based on the audio but do that later
        //let circle_list= []

        for(let j=0; j<max_num_of_circles; j++){
            let circle = document.createElement("div")

            circle.style.width = circle.style.height = ((j/max_num_of_circles)*circle_max_diameter)+'px';//set the height and width attributes with
            //their loop number divided by (the total count of circles*the max diameter)
            circle.classList.add("circle");//set the class attribute in the dom element to circle
            //circle_list.push(circle);//add the new dom element to the circles array
            container.appendChild(circle);//add the new dom element into the dom

        }
        container.setAttribute("init", "true")
        console.log(`finished set up on ${container_id}`)
}

change_circle_css = function(frequencyData, circle_elem_list){//declare a function called renderFrame, with frequency data being passed in

    max = 180
    
    for(var i=0;i<circle_elem_list.length;i++){//loop through the circles array, which hold all the dom element circles
        var circle=circle_elem_list[i]
        let new_scale = frequencyData[i]/max

        //change the css scale attribute for that dom element by setting it to (the entry i in frequency data / by max
        let potential_size = circle.style.width * new_scale
        
        if(potential_size > max){
            let max_scale = max / circle.style.width
            circle.style.transform = `scale(${(max_scale)}, ${(max_scale)})`
        }
        else{
            circle.style.transform = `scale(${(new_scale)}, ${(new_scale)})`
        }
    }
}

circle_reinit=function(container_id){
    let circle_list = document.getElementById(container_id).getElementsByClassName("circle")

    for(let j=0; j<circle_list.length; j++){
        circle_list[j].style.visibility = "visible"
    }
}

cleanup_circle_css = function(circle_elem_list){

    for(var i=circle_elem_list.length-1;i>=0;i--){//loop through the circles array, which hold all the dom element circles
        var circle=circle_elem_list[i]

        //change the css scale attribute for that dom element by setting it to (the entry i in frequency data / by max
        //circle.style.cssText=`scale(0.0001, 0.0001)`
        circle.style.visibility = "hidden"
    }
}

start_draw=(pos_x, pos_y)=>{

    //temp animation, aka none
    let canvas = document.getElementById('my_canvas');
    let context = canvas.getContext('2d');
    let radius = 50;

    context.beginPath()
    context.arc(pos_x, pos_y, radius, 0, 2 * Math.PI, false)
    context.fillStyle = "green"
    context.fill()
}

stop_draw=(pos_x, pos_y)=>{

    //temp animation, aka none
    let canvas = document.getElementById('my_canvas')
    let context = canvas.getContext('2d')
    let radius = 50 +0.55

    context.beginPath()
    context.arc(pos_x, pos_y, radius, 0, 2 * Math.PI, false)
    context.fillStyle = "bisque"
    context.fill()
}

handleKeyUp=()=>{
    if(isRecording){
        //not really important in practiccality
    }
    stopColour(event.key)                     //call function to stop drawing associated key

    let i = keys_down_list.indexOf(event.key)   //get index of key released, no need to check 
                                                //if it's in the array as handleKeyDown insures it is

    keys_down_list.splice(i, 1)                 //use splice to remove 1 element beginning at position i
                                                //from the array keys_down_list                                           
    console.log(keys_down_list)
}

handleKeyDown =()=>{
    if(!keys_down_list.includes(event.key)){    //check if storing array has the key pressed already
        if(isRecording){
            let press_time = new Date().getTime()
            let key_press = event.key
            recording_notes.push(
                {
                    key_pressed : key_press,
                    key_pressed_time : press_time
                }
            )
        }
        keys_down_list.push(event.key)          //add the key to list of keys being pressed
        
        drawColour(event.key)                   //call function to start drawing associated key
    }
}

saveRecording=()=>{   
    try{
        let my_request = new XMLHttpRequest()
        let method_type = "POST" //GET or POST depending on if you want to send or receive data
        let url = "/insert"
        let is_asynchronous = true
        let start_limit = 0

        let query_config = {
            recording_start_time : recording_start_time,
            recording_end_time : recording_end_time,
            recording_notes : recording_notes
        }
        //open the xml http request with the insert url and POST as the type of request, also make it asynchronous
        my_request.open(method_type, url, is_asynchronous)
        //add the json stringified object to the request header cause we've had problems with just sending it normally
        my_request.setRequestHeader("json_stringified_object", JSON.stringify(query_config));
        //send the request
        my_request.send(JSON.stringify(query_config))

        //after sql is done, add a new drop down option to the dom
        let drop_down = document.getElementById("recording_list")
        let new_option = document.createElement("option")
        new_option.innerHTML = recording_start_time
        drop_down.appendChild(new_option)

        //empty the variables
        recording_start_time = null
        recording_end_time = null
        recording_notes = []
    }
    catch(exception){ 
        console.log("something went wrong: my_script.js") 
        console.log(exception)
    }
}

startTimer=()=>{
    // Update the count down every 1 second (1000 miliseconds)

    let original = document.getElementById("recording_time").innerHTML
    var x = setInterval(function() {
        let countdown = document.getElementById("recording_time").innerHTML
        document.getElementById("recording_time").innerHTML = (parseInt(countdown)) -1;
        
        // If the count down is finished, end the interval and reset visual timer 
        if (countdown <= 0) {
            clearInterval(x);
            document.getElementById("recording_time").innerHTML = original;//set the counter to it's original on the page
            isRecording = false//set recording to false to prevent further key presses
            recording_end_time = new Date().getTime()
            saveRecording()
        }
    }, 1000);
}

startRecording=()=>{
    event.preventDefault()
    isRecording = true
    recording_start_time = new Date().getTime()

    //start the on screen timer
    startTimer()
}

startPlayBack=()=>{
    event.preventDefault()
    try{
        let my_request = new XMLHttpRequest()
        let method_type = "POST" //GET or POST depending on if you want to send or receive data
        let url = "/select"
        let is_asynchronous = true
        
        let select_element = document.getElementById("recording_list")
        let selected_option = select_element.options[select_element.selectedIndex].text
        
        //dont do any query unless the user has selected a recording in the drop down
        if(selected_option != "Select a file"){
            let query = `SELECT DISTINCT * FROM recordings WHERE start_time = ${selected_option};`
            let notes = []
                
            //open the xml http request with the select url and POST as the type of request, also make it asynchronous
            my_request.open(method_type, url, is_asynchronous)
            //add the json stringified object to the request header cause we've had problems with just sending it normally
            my_request.setRequestHeader("json_stringified_object", JSON.stringify(query));
            
            //must tell the request to do 
            my_request.onreadystatechange = function() {
                //if state is 4 (aka, all done here's my response...)
                if (my_request.readyState == 4) {
                    let returned_set = JSON.parse(my_request.responseText)
                    
                    let start, end, delay, key
                    if(returned_set.notes.length > 0){
                        start = returned_set.start_time
                        end = returned_set.end_time
                    }
    
                    for(let i=0; i<returned_set.notes.length; i++){
                        setTimeout(function(){
                            drawColour(returned_set.notes[i].recorded_key_pressed)//execute the draw colour function with the stored key
                            }, 
                            (returned_set.notes[i].recorded_pressed_time - start + 1000)//set time to wait before executing
                        )
                        setTimeout(function(){
                            stopColour(returned_set.notes[i].recorded_key_pressed)//execute the stop colour function with the stored key
                            }, 
                            (returned_set.notes[i].recorded_pressed_time - start + 1000 + 200)//set time to wait before executing
                        )
                    }
                }
            }
            
            //send the request
            my_request.send(JSON.stringify(query))
    
        }
    }//end of try
    catch(exception){
        console.log("something went wrong while performing the query")
    }
    console.log("finished playback")
}

window.onload=()=>{
    try{
        let my_request = new XMLHttpRequest()
        let method_type = "POST" //GET or POST depending on if you want to send or receive little/alot of data
        let url = "/list_recordings"
        let is_asynchronous = true

        //open the xml http request with the insert url and POST as the type of request, also make it asynchronous
        my_request.open(method_type, url, is_asynchronous)
        
        //make the function to handle the response from the server before sending it
        my_request.onreadystatechange = function() {
            //if state is 4 (aka, all done here's my response...)
            if (my_request.readyState == 4) {
                let list_element = document.getElementById("recording_list")
                let returned_list_array = JSON.parse(my_request.responseText)
                let list_child

                //loop through all the distinct recordings and add them to the dom
                for(let i=0; i<returned_list_array.length; i++){
                    list_child = document.createElement("option")
                    list_child.innerHTML = returned_list_array[i]
                    list_element.appendChild(list_child)
                }
            }
        }

        //send the request
        my_request.send()

    }
    catch(exception){
        console.log(`exception happened and caught in window.onload: ${exception}`)
    }
}

playback.addEventListener("click", startPlayBack)
record.addEventListener("click", startRecording)    //add event listener to the record button on the page
document.addEventListener("keydown", handleKeyDown) //add the event listener to the dom's key down
document.addEventListener("keyup", handleKeyUp)     //add the event listener to the dom's key up